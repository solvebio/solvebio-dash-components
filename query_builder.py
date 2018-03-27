import ast

import json

import uuid

from string import Template

import dash
import dash_html_components as html
import dash_core_components as dcc
from dash.dependencies import Input, Output

import solvebio_dash_components as sdc

EMPTY_QUERY_TREE = ('["~#iM",["type","group","id",'
                    '"8a888b9a-0123-4456-b89a-b1624f8c67de","children1",'
                    '["~#iOM",["988ba8a9-89ab-4cde-b012-31624f8cc853",'
                    '["^0",["type","rule","id",'
                    '"988ba8a9-89ab-4cde-b012-31624f8cc853","properties",'
                    '["^0",["field",null,"operator",null,"value",["~#iL",[]],'
                    '"valueSrc",["^2",[]],"operatorOptions",null]]]]]],'
                    '"properties",["^0",["conjunction","AND"]]]]')

app = dash.Dash('')

app.scripts.config.serve_locally = True

app.layout = html.Div([
    dcc.Textarea(
        id='query',
        placeholder='No filters selected',
        style={'width': '40%', 'height': '300'}
    ),
    sdc.QueryBuilder(
        id='query-builder',
        value=EMPTY_QUERY_TREE
    )
])


@app.callback(
    Output('query-builder', 'value'),
    [Input('query', 'value')])
def generate_query(query):
    if query:
        query = ast.literal_eval(query)
        tree = tree_builder(query)
        wrapped_tree = tree_wrapper(tree, query)
        return wrapped_tree
    else:
        return EMPTY_QUERY_TREE


def tree_builder(query):
    tree = []
    # Dict only has one key of type 'or' or 'and'
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
                              '"${conjunction}"]],"children1",'
                              '["^1",[${tree}]]]]')

    for f in filters:
        if isinstance(f, dict):
            # Dict only has one key of type 'or' or 'and'
            conjunction = f.keys()[0]

            tree.append(group_template.substitute(
                id=uuid.uuid4(),
                conjunction=conjunction.upper(),
                tree=tree_builder(f)
            ))
        elif isinstance(f, list):
            field, value = f
            field, operator = (field.split('__') if '__' in field
                               else (field, None))

            operator = assign_operator(operator, value)
            value_type = assign_value_type(value)

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
                                     '"${conjunction}"]]]]')
    conjunction = query.keys()[0]

    wrapped_tree = wrapped_tree_template.substitute(
        id=uuid.uuid4(),
        tree=tree,
        conjunction=conjunction.upper()
    )

    return wrapped_tree


def is_regex(value):
    return (True if type(value) in (str, unicode) and value[0] == '^'
            else False)


def assign_value_type(value):
    type_dict = {
        int: '"number"',
        float: '"number"',
        str: '"text"',
        unicode: '"text"',
        bool: '"boolean"',
        type(None): '',
        list: '"multiselect"'
    }

    return type_dict[type(value)]


def assign_operator(operator, value):
    operator_dict = {
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
        operator = operator_dict[operator]
    elif value is None:
        operator = 'is_none'
    elif value in (True, False):
        operator = 'is'

    return operator


if __name__ == '__main__':
    app.run_server(debug=True)
