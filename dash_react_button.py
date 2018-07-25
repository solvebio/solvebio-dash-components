# -*- coding: utf8 -*-
import os

from flask import send_from_directory

from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
from dash.exceptions import PreventUpdate

from solvebio.contrib.dash import SolveBioDash
import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='Dash React Button',
    app_url='http://local.solvebio.com:8050',
    client_id='1hkxnjgvqet1wt43qam72ffdgd5frxrf8kqn0voc')

app.scripts.config.serve_locally = True

app.layout = html.Div(
    children=[
        html.Div(
            id='counter'),
        sdc.DashReactButton(
            id='button',
            children='Click me',
            className="hyrule--button  hyrule--button--primary"),
        dcc.Input(
            id='input',
            placeholder='Enable button',
            className="dash--short")],
    className="container  hyrule--dash  hyrule--dash__inputs")


@app.callback(
    Output('button', 'disabled'),
    [Input('input', 'value')])
def enable_button(input_value):
    return False


@app.callback(
    Output('counter', 'children'),
    [Input('button', 'n_clicks')])
def show_counter(n_clicks):
    return n_clicks


@app.callback(
    Output('button', 'id'),
    [Input('button', 'disabled')])
def load_button_props(_):
    raise PreventUpdate()


# SolveBio CSS
app.css.append_css({
    "external_url":
    "//solvebio.s3.amazonaws.com/static/"
    "6.1.4-28a2dd7ad/mesh/css/style.css"
})


@app.server.route('/static/style.css')
def serve_stylesheet():
    assets_dir = os.path.join(os.getcwd(), 'assets')
    return send_from_directory(assets_dir, 'style.css')


if __name__ == '__main__':
    app.run_server(debug=True)
