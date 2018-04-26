import json

import uuid

from string import Template

from flask import g

import dash_core_components as dcc
import dash_html_components as html
import dash_table_experiments as dt
from dash.dependencies import Input, Output, State

from solvebio.contrib.dash import SolveBioDash
import solvebio_dash_components as sdc
import solvebio

app = SolveBioDash(
    name=__name__,
    title='NGS Filtering App',
    app_url='https://ngsfilterer.apps.solvebio.net',
    client_id='0lxt2cuv78f9a2zynlpqgxoc3o1pgb4whwd5z5wk')

EMPTY_QUERY = ('["~#iM",["type","group","id",'
               '"8a888b9a-0123-4456-b89a-b1624f8c67de","children1",'
               '["~#iOM",["988ba8a9-89ab-4cde-b012-31624f8cc853",["^0",'
               '["type","rule","id","988ba8a9-89ab-4cde-b012-31624f8cc853",'
               '"properties",["^0",["field",null,"operator",null,"value",'
               '["~#iL",[]],"valueSrc",["^2",[]],"operatorOptions",null]]]],'
               '"b8b99b9a-0123-4456-b89a-b1629cd29e73",["^0",["type","rule",'
               '"id","b8b99b9a-0123-4456-b89a-b1629cd29e73","properties",'
               '["^0",["field",null,"operator",null,"value",["^0",[]],'
               '"valueSrc",["^0",[]],"operatorOptions",null]]]]]],'
               '"properties",["^0",["conjunction","AND","not",false]]]]')

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content'),
    html.Br(),
    html.Div(id='filtered-dataset'),

    # Placeholder components
    sdc.DashPackageLoader(),
    html.Div(dt.DataTable(rows=[{}]), style={'display': 'none'}),
])


@app.callback(
    Output('page-content', 'children'),
    [Input('url', 'pathname')])
def display_page(pathname):
    SAMPLE_DATASET_ID = '697110207794093252'
    # Converts from ES data type to QueryBuilder-compatible data type
    TYPE_DICT = {
        'string': 'text',
        'long': 'number',
        'double': 'number',
        'float': 'number',
        'boolean': 'boolean'
    }

    dataset = g.client.Dataset.retrieve(SAMPLE_DATASET_ID)

    fields = {
        field.name: {
            'label': field.name,
            'type': TYPE_DICT[field.data_type],
            'valueSources': ['value']
        }
        for field in list(dataset.fields(limit=10000))
        if field.data_type != u'auto'
    }

    with open('test/filters.json') as saved_filters:
        filters = saved_filters.read()
        filters = json.loads(filters)
        filters = filters['filters']
        filters = [
            {
                'label': f.keys()[0],
                'value': json.dumps(f.values()[0])
            }
            for f in filters
        ]

    return (
        html.Div(dcc.Input(
            placeholder='ID of the dataset',
            value=SAMPLE_DATASET_ID,
            id='dataset-id',
            type='text'
        )),
        html.Br(),
        html.Div('Saved filters: ', style={'margin': '10'}),
        html.Div(
            dcc.RadioItems(
                id='saved-filters',
                options=filters,
                value=''
            ),
            style={
                'margin-left': '26',
                'width': '40%'
            }
        ),
        html.Br(),
        html.Div('Text-based filter builder: ', style={'margin': '10'}),
        html.Div(
            dcc.Textarea(
                id='query',
                style={'width': '40%', 'height': '150'},
                value=''
            ),
            style={
                'margin-left': '26'
            }
        ),
        sdc.QueryBuilder(
            id='query-builder',
            value=EMPTY_QUERY,
            fields=json.dumps(fields)
        ),
        html.Br(),
        html.Span(
            html.Button('Apply Filters', id='apply-filters-button'),
            style={'padding': '2px'}
        ),
        html.Span(
            html.Button('Save Filters', id='save-filters-button'),
            style={'padding': '2px'}
        ),
        html.Span(
            html.Button('Clear Filters', id='clear-filters-button'),
            style={'padding': '2px'}
        ),
    )


@app.callback(
    Output('url', 'pathname'),
    [Input('save-filters-button', 'n_clicks')],
    [State('query-builder', 'filters')])
def save_filters(_, new_filters):
    if new_filters:
        new_filters = json.loads(new_filters)
        with open('test/filters.json') as saved_filters:
            all_filters = saved_filters.read()
            all_filters = json.loads(all_filters)
            all_filters['filters'].append({
                'filter'+str(len(all_filters['filters'])+1): new_filters
            })
        with open('test/filters.json', 'w') as saved_filters:
            saved_filters.write(json.dumps(all_filters, indent=4))
        return '/'


@app.callback(
    Output('query', 'value'),
    [Input('saved-filters', 'value')])
def show_selected_filters(filters):
    return json.dumps(json.loads(filters), indent=4) if filters else ''


@app.callback(
    Output('saved-filters', 'value'),
    [Input('clear-filters-button', 'n_clicks')])
def clear_selected_filters(_):
    return ''


@app.callback(
    Output('filtered-dataset', 'children'),
    [Input('apply-filters-button', 'n_clicks')],
    [State('query-builder', 'filters'),
     State('dataset-id', 'value')])
def apply_selected_filters(_, modified_filters, dataset_id):
    # TODO if previous filters == current, don't do anything
    try:
        SELECTED_COLS = ['sample', 'variant']

        filters = [json.loads(modified_filters)] if modified_filters else None

        dataset = g.client.Dataset.retrieve(dataset_id)

        query = dataset.query(fields=SELECTED_COLS, filters=filters)

        rows = list(query[:100])
        min_height = 350

        output = (
            html.Div('Number of records: ' + str(len(query))),
            html.Div(dt.DataTable(
                id='data-table',
                rows=rows,
                columns=SELECTED_COLS,
                min_height=min_height
            ))
        )
    except solvebio.SolveError:
        output = html.H6('No such dataset found')
    except Exception:
        output = html.H6('No dataset specified')
    finally:
        return output


@app.callback(
    Output('query-builder', 'value'),
    [Input('query', 'value')])
def generate_query(query):
    if query:
        query = json.loads(query)
        tree = tree_builder(query)
        wrapped_tree = tree_wrapper(tree, query)
        return wrapped_tree
    else:
        return EMPTY_QUERY


def tree_builder(query):
    tree = []
    if query.keys()[0] == 'not':
        is_not = 'true'
        conjunction = query['not'].keys()[0]
        filters = query['not'][conjunction]
    else:
        is_not = 'false'
        conjunction = query.keys()[0]
        filters = query[conjunction]

    rule_template = Template('"${id}",["^0",["type","rule","id","${id}",'
                             '"properties",["^0",["field","${field}",'
                             '"operator","${operator}","value",["~#iL",'
                             '[${value}]],"valueSrc",["^2",["value"]],'
                             '"operatorOptions",null,"valueType",["^2",'
                             '[${value_type}]]]]]]')
    group_template = Template('"${id}",["^0",["type","group","id","${id}",'
                              '"properties",["^0",["conjunction",'
                              '"${conjunction}","not",${is_not}]],"children1",'
                              '["^1",[${tree}]]]]')

    for f in filters:
        if isinstance(f, dict):
            if f.keys()[0] == 'not':
                is_not = 'true'
                conjunction = f['not'].keys()[0]
            else:
                is_not = 'false'
                conjunction = f.keys()[0]

            tree.append(group_template.substitute(
                id=uuid.uuid4(),
                conjunction=conjunction.upper(),
                is_not=is_not,
                tree=tree_builder(f)
            ))
        elif isinstance(f, list):
            field, value = f
            field, operator = (field.split('__') if '__' in field
                               else (field, None))

            operator = assign_operator(operator, value)
            value_type = assign_value_type(value)

            if operator == 'select_any_in':
                value = "{}".format(','.join(value))

            # Add '~' if regex
            value = (json.dumps('~' + value) if is_regex(value)
                     else json.dumps(value))

            tree.append(rule_template.substitute(
                id=uuid.uuid4(),
                field=field,
                operator=operator,
                value=value,
                value_type=value_type
            ))
    return ','.join(tree)


def tree_wrapper(tree, query):
    wrapped_tree_template = Template('["~#iM",["type","group","id","${id}",'
                                     '"children1",["~#iOM",[${tree}]],'
                                     '"properties",["^0",["conjunction",'
                                     '"${conjunction}","not",${is_not}]]]]')
    if query.keys()[0] == 'not':
        is_not = 'true'
        conjunction = query['not'].keys()[0]
    else:
        is_not = 'false'
        conjunction = query.keys()[0]

    wrapped_tree = wrapped_tree_template.substitute(
        id=uuid.uuid4(),
        tree=tree,
        conjunction=conjunction.upper(),
        is_not=is_not
    )

    return wrapped_tree


def is_regex(value):
    return (True if type(value) in (str, unicode) and value[0] == '^'
            else False)


def assign_value_type(value):
    # TODO remove this TYPE_DICT and grab type from fields in display_page()
    TYPE_DICT = {
        int: '"number"',
        float: '"number"',
        str: '"text"',
        unicode: '"text"',
        bool: '"boolean"',
        type(None): '',
        list: '"text"'
    }

    return TYPE_DICT[type(value)]


def assign_operator(operator, value):
    # Converts from ES operator to QueryBuilder-compatible operator
    OPERATOR_DICT = {
        'lt': 'less',
        'lte': 'less_or_equal',
        'gt': 'greater',
        'gte': 'greater_or_equal',
        'in': 'select_any_in',
        'contains': 'contains',
        'prefix': 'prefix',
        'regex': 'regex'
    }
    if operator:
        operator = OPERATOR_DICT[operator]
    elif value is None:
        operator = 'is_none'
    elif value in (True, False):
        operator = 'is'
    elif type(value) == int:
        operator = 'equal'

    return operator


# Dash CSS
app.css.append_css(
    {"external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"})

# Loading screen CSS
app.css.append_css(
    {"external_url": "https://codepen.io/davidhpark/pen/eMomWj.css"})

if __name__ == '__main__':
    app.run_server(debug=True)
