import json

import uuid

from string import Template

from flask import g

import dash_core_components as dcc
import dash_html_components as html
import dash_table_experiments as dt
from dash.dependencies import Input, Output, State

from solvebio.contrib.dash import SolveBioDash
from solvebio import SolveError
import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='NGS Reporting App',
    # app_url='https://ngsfilterer.apps.solvebio.net',
    app_url='http://local.solvebio.com:8050',
    client_id='0lxt2cuv78f9a2zynlpqgxoc3o1pgb4whwd5z5wk'
)

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

    # Placeholder component
    sdc.DashPackageLoader(),
    html.Div(dt.DataTable(rows=[{}]), style={'display': 'none'}),
])


@app.callback(
    Output('page-content', 'children'),
    [Input('url', 'pathname')])
def display_page(pathname):
    SAMPLE_DATASET_ID = '657169994561270370'
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
        # TODO add 'auto' data_type (what is 'auto'?)
        if field.data_type != u'auto'
    }

    with open('test/filters.txt') as saved_filters:
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
        with open('test/filters.txt') as saved_filters:
            all_filters = saved_filters.read()
            all_filters = json.loads(all_filters)
            all_filters['filters'].append({
                'filter'+str(len(all_filters['filters'])+1): new_filters
            })
        with open('test/filters.txt', 'w') as saved_filters:
            saved_filters.write(json.dumps(all_filters, indent=4))
            # f.write(json.dumps(filter_value))
            # f.write('#')
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
        # filters = (json.loads(modified_filters)
        #            if json.loads(modified_filters)[0]
        #            else None)

        # filter_names = [str(json.loads(f)['label'])
        #                 for f in selected_filters]
        # filter_names = ('None' if len(filter_names) == 0
        #                 else ', '.join(filter_names))

        dataset = g.client.Dataset.retrieve(dataset_id)

        query = dataset.query(fields=SELECTED_COLS, filters=filters)

        rows = list(query[:100])
        min_height = 350

        output = (
            html.Div('Number of records: ' + str(len(query))),
            # html.Div('Filters applied: ' + filter_names),
            html.Div(dt.DataTable(
                id='data-table',
                rows=rows,
                columns=SELECTED_COLS,
                min_height=min_height
            ))
        )
    except SolveError:
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


# The basic "global exclusion filters"
# We will split them up into individual toggles
# and some will have threshold inputs.
filters = [{
    "and": [
        {"not": {
            # Exclude any of the following
            "or": [
                # PASS=False
                ["pass", False],
                # not Gene
                ["gene", None],
                # depth < $filt_depth
                ["depth__lt", 3],
                # VD < $min_vd and $min_af_vd? < 0.5
                {"and": [["vd__lt", 3], ["allelefreq__lt", 0.5]]},
                # Exclude some variant types
                ["type__in", ["protein_protein_contact",
                              "structural_interaction_variant"]],
                # HLA gene (exclude HLA genes)
                ["gene__prefix", "HLA-"],
                # Olfactory gene (exclude olfactory genes)
                ["gene__regex", "^OR\d+\S\d+"],
                # MSI filters
                {
                    "and": [
                        # TODO: change_len requires vardict_txt
                        #       migration with base_fields
                        # ["change_len", 1],
                        ["msi__gt", 1],
                        {
                            "or": [
                                {"and": [["msi__lte", 2],
                                         ["allelefreq__lt", 0.005]]},
                                {"and": [["msi__lte", 4],
                                         ["allelefreq__lt", 0.01]]},
                                {"and": [["msi__lte", 7],
                                         ["allelefreq__lt", 0.03]]},
                                {"and": [["msi", 8],
                                         ["allelefreq__lt", 0.06]]},
                                {"and": [["msi", 9],
                                         ["allelefreq__lt", 0.125]]},
                                {"and": [["msi", 10],
                                         ["allelefreq__lt", 0.175]]},
                                {"and": [["msi", 11],
                                         ["allelefreq__lt", 0.25]]},
                                {"and": [["msi", 12],
                                         ["allelefreq__lt", 0.3]]},
                                {"and": [["msi__gt", 12],
                                         ["allelefreq__lt", 0.35]]}
                            ]
                        }
                    ]
                },
                {
                    "and": [
                        # TODO: change_len requires vardict_txt
                        #       migration with base_fields
                        # ["change_len", 3],
                        ["msi__gte", 5],
                        ["allelefreq__lt", 0.1]
                    ]
                }
            ]
        }}
        # Exclude all Artifacts (see fields for expressions)
        # ["artifacts", None],
    ]
}]

# Dash CSS
app.css.append_css(
    {"external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"})

# Loading screen CSS
app.css.append_css(
    {"external_url": "https://codepen.io/davidhpark/pen/OQdKjJ.css"})

if __name__ == '__main__':
    app.run_server(debug=True)

# import json

# import uuid

# from string import Template

# import dash
# import dash_html_components as html
# import dash_core_components as dcc
# from dash.dependencies import Input, Output

# import solvebio_dash_components as sdc

# EMPTY_QUERY_TREE = ('["~#iM",["type","group","id",'
#                     '"8a888b9a-0123-4456-b89a-b1624f8c67de","children1",'
#                     '["~#iOM",["988ba8a9-89ab-4cde-b012-31624f8cc853",'
#                     '["^0",["type","rule","id",'
#                     '"988ba8a9-89ab-4cde-b012-31624f8cc853","properties",'
#                     '["^0",["field",null,"operator",null,"value",["~#iL",[]],'
#                     '"valueSrc",["^2",[]],"operatorOptions",null]]]]]],'
#                     '"properties",["^0",["conjunction","AND"]]]]')

# app = dash.Dash('')

# app.scripts.config.serve_locally = True

# app.layout = html.Div([
#     # html.Div('Text-based filter builder: ', style={'margin': '10'}),
#     # html.Div(
#     #     dcc.Textarea(
#     #         id='query',
#     #         style={'width': '40%', 'height': '150'}
#     #     ),
#     #     style={
#     #         'margin-left': '26'
#     #     }
#     # ),
#     sdc.QueryBuilder(
#         id='query-builder',
#         value=EMPTY_QUERY_TREE,
#         filters=None
#     ),
#     html.Div('Current filters: ', style={'margin-left': '10'}),
#     html.Div(dcc.Textarea(
#         id='current-filters',
#         style={'width': '40%', 'height': '300'}
#     ), style={'margin-left': '26', 'margin-top': '10'})
# ])


# # @app.callback(
# #     Output('query', 'value'),
# #     [Input('query-builder', 'filters')])
# # def show_filter(filters):
# #     return filters


# @app.callback(
#     Output('query-builder', 'value'),
#     [Input('query-builder', 'filters')])
# def generate_query(query):
#     print query
#     if query:
#         query = json.loads(query)
#         tree = tree_builder(query)
#         wrapped_tree = tree_wrapper(tree, query)
#         print wrapped_tree
#         return wrapped_tree
#     else:
#         return EMPTY_QUERY_TREE


# def tree_builder(query):
#     tree = []
#     # Dict only has one key of type 'or' or 'and'
#     conjunction = query.keys()[0]
#     filters = query[conjunction]
#     rule_template = Template('"${id}",["^0",["type","rule","id","${id}",'
#                              '"properties",["^0",["field","${field}",'
#                              '"operator","${operator}","value",["~#iL",'
#                              '[${value}]],"valueSrc",["^2",["value"]],'
#                              '"operatorOptions",null,"valueType",["^2",'
#                              '[${value_type}]]]]]]')
#     group_template = Template('"${id}",["^0",["type","group","id","${id}",'
#                               '"properties",["^0",["conjunction",'
#                               '"${conjunction}"]],"children1",'
#                               '["^1",[${tree}]]]]')

#     for f in filters:
#         if isinstance(f, dict):
#             # Dict only has one key of type 'or' or 'and'
#             conjunction = f.keys()[0]

#             tree.append(group_template.substitute(
#                 id=uuid.uuid4(),
#                 conjunction=conjunction.upper(),
#                 tree=tree_builder(f)
#             ))
#         elif isinstance(f, list):
#             field, value = f
#             field, operator = (field.split('__') if '__' in field
#                                else (field, None))

#             operator = assign_operator(operator, value)
#             value_type = assign_value_type(value)

#             # Add '~' if regex
#             value = (json.dumps('~' + value) if is_regex(value)
#                      else json.dumps(value))

#             tree.append(rule_template.substitute(
#                 id=uuid.uuid4(),
#                 field=field,
#                 operator=operator,
#                 value=value,
#                 value_type=value_type
#             ))
#     return ','.join(tree)


# def tree_wrapper(tree, query):
#     wrapped_tree_template = Template('["~#iM",["type","group","id","${id}",'
#                                      '"children1",["~#iOM",[${tree}]],'
#                                      '"properties",["^0",["conjunction",'
#                                      '"${conjunction}"]]]]')
#     conjunction = query.keys()[0]

#     wrapped_tree = wrapped_tree_template.substitute(
#         id=uuid.uuid4(),
#         tree=tree,
#         conjunction=conjunction.upper()
#     )

#     return wrapped_tree


# def is_regex(value):
#     return (True if type(value) in (str, unicode) and value[0] == '^'
#             else False)


# def assign_value_type(value):
#     type_dict = {
#         int: '"number"',
#         float: '"number"',
#         str: '"text"',
#         unicode: '"text"',
#         bool: '"boolean"',
#         type(None): '',
#         list: '"multiselect"'
#     }

#     return type_dict[type(value)]


# def assign_operator(operator, value):
#     operator_dict = {
#         'lt': 'less',
#         'lte': 'less_or_equal',
#         'gt': 'greater',
#         'gte': 'greater_or_equal',
#         'in': 'select_any_in',
#         'contains': 'contains',
#         'prefix': 'prefix',
#         'regex': 'regex'
#     }
#     if operator:
#         operator = operator_dict[operator]
#     elif value is None:
#         operator = 'is_none'
#     elif value in (True, False):
#         operator = 'is'

#     return operator


# if __name__ == '__main__':
#     app.run_server(debug=True)
