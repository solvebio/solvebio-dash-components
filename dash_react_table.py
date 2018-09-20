import json

from dash.dependencies import Input, Output
from dash.exceptions import PreventUpdate
import dash_html_components as html

from solvebio.contrib.dash import SolveBioDash
import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='Dash React Table',
    app_url='http://127.0.0.1:8050',
    client_id='0lxt2cuv78f9a2zynlpqgxoc3o1pgb4whwd5z5wk')

columns = [{'Header': 'A',
            'accessor': 'a'},
           {'Header': 'B',
            'accessor': 'b'},
           {'Header': 'C',
            'accessor': 'c'}]

data = [{'a': '1', 'b': '2', 'c': '3'},
        {'a': '2', 'b': '3', 'c': '1'},
        {'a': '3', 'b': '1', 'c': '2'}]

sortBy = [{'id': 'c'}]

app.layout = html.Div(
    sdc.DashReactTable(
        id='table',
        data=json.dumps(data),
        columns=json.dumps(columns),
        sortBy=json.dumps(sortBy),
        unknown=False))


@app.callback(
    Output('table', 'id'),
    [Input('table', 'data')])
def load_set_props(_):
    raise PreventUpdate()


if __name__ == '__main__':
    app.run_server(debug=True)
