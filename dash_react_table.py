import json
import os
import uuid

from flask import send_from_directory

from dash.dependencies import Input, Output
from dash.exceptions import PreventUpdate
import dash_html_components as html

from solvebio.contrib.dash import SolveBioDash
import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='Dash React Table',
    app_url='http://127.0.0.1:8050',
    client_id='0lxt2cuv78f9a2zynlpqgxoc3o1pgb4whwd5z5wk',
    salt='dash_react_table')

columns = [
    {
        'Header': 'Flags',
        'accessor': 'flags',
        'Cell': 'pill',
        'pillAccessor': 'flags'
    },
    {
        'Header': 'A',
        'accessor': 'flags',
        'Cell': 'comments',
        'commentsAccessor': 'comments',
        'filterMethod': 'list'
    },
    {
        'Header': 'B',
        'accessor': 'b'
    },
    {
        'Header': 'C',
        'accessor': 'c'
    }
]

# data = [{'a': '1', 'b': '2', 'c': '3', 'comments': ['tag1', 'tag2'], 'commentsUrl': 'comments?variant=SPOP'},
#         {'a': '2', 'b': '3', 'c': '1', 'comments': ['tagA', 'tagB'], 'commentsUrl': 'comments?variant=KRAS'},
#         {'a': '3', 'b': '1', 'c': '2'}]

data = [
    {
        'a': '1',
        'b': '2',
        'c': '3',
        'flags': ['tag1', 'tag2'],
        'comments': [
            {
                'flags': ['tag1'],
                'comment': 'This is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a commentThis is a comment'
            },
            {
                'flags': ['tag2'],
                'comment': 'This is a comment'
            }
        ],
        'commentsUrl': 'comments?variant=variant1'
    },
    {
        'a': '2',
        'b': '3',
        'c': '1',
        'flags': ['tagA', 'tagB'],
        'comments': [
            {
                'flags': ['tagA'],
                'comment': 'tagA comment'
            },
            {
                'flags': ['tagB'],
                'comment': 'tagA comment'
            }
        ],
        'commentsUrl': 'comments?variant=variant2'
    },
    {
        'a': '3',
        'b': '1',
        'c': '2'
    }
]

sortBy = [{'id': 'c'}]

app.layout = html.Div(
    sdc.DashReactTable(
        id='table',
        data=json.dumps(data),
        columns=json.dumps(columns),
        sortBy=json.dumps(sortBy),
        unknown=False))

# app.css.append_css({
#     'external_url': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
# })

app.css.append_css({
    "external_url":
    "//solvebio.s3.amazonaws.com/static/v6.6.0-209641abac/mesh/css/style.css"
})

# Add a UUID cache buster to reload CSS every time
app.css.append_css({
    "external_url": "/static/style.css{}"
    .format('?v={}'.format(uuid.uuid4()))
})


@app.server.route('/static/style.css')
def serve_stylesheet():
    assets_dir = os.path.join(os.getcwd(), 'assets')
    return send_from_directory(assets_dir, 'style.css')


@app.callback(
    Output('table', 'id'),
    [Input('table', 'data')])
def load_set_props(_):
    raise PreventUpdate()


if __name__ == '__main__':
    app.run_server(debug=True)
