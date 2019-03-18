import os
import uuid

from flask import send_from_directory

import dash_html_components as html

from solvebio.contrib.dash import SolveBioDash

import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='DashReactSelect')

app.layout = html.Div(
    sdc.DashReactSelect(
        placeholder='Select gene',
        children=[
            html.Div(
                children=[
                    html.I(
                        className="icon--ui-2_alert-circle-i  font--largest  color--blue-base  margin--right-smallest"),
                    html.P(
                        children=[
                            'Hit ',
                            html.Span(
                                'Enter',
                                className="display--inline-block  bg--white-base  padding--y-micro  padding--x-tinier  border-radius--base  border--base  box-shadow--card  margin--x-tiniest"),
                            ' to add each value separately'
                        ])
                ],
                className="display--flex  flex-align-items--center")
        ]),
    className='dash-react-select  padding--top-massive')

# SolveBio CSS
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


if __name__ == '__main__':
    app.run_server()
