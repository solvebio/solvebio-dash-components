import os
import dash
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_table_experiments as dt
import json
from flask import g, request

from solvebio.contrib.dash import SolveBioDash
from solvebio import Dataset, DatasetImport

import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='Dropzone',
    app_url='http://local.solvebio.com:8050',
    client_id='1hkxnjgvqet1wt43qam72ffdgd5frxrf8kqn0voc')

app.scripts.config.serve_locally = True

app.layout = html.Div([
    sdc.DashS3Uploader(
        id='dropzone',
        dropzone=True,
        auto_upload=True
    ),
    html.Div(id='table'),
    # Placeholder DataTable component (https://community.plot.ly/t/display-tables-in-dash/4707/40)
    html.Div(dt.DataTable(rows=[{}]), style={'display': 'none'})
])


@app.callback(
    Output('dropzone', 'signed_files'),
    [Input('dropzone', 'files')])
def generate_s3_url(files):
    """Takes files from React side, creates SolveBio Object containing signed S3 URL."""
    if files:
        vault = g.client.Vault.get_personal_vault()
        files = json.loads(files)
        objects = []
        for i in xrange(len(files)):
            obj = g.client.Object.create(
                vault_id=vault.id,
                object_type='file',
                filename=files[i].get('filename'),
                mimetype=files[i].get('mimetype'),
                size=files[i].get('size')
            )
            objects.append({
                'id': obj.id,
                'filename': obj.filename,
                'upload_url': obj.upload_url
            })
        return json.dumps(objects)


@app.callback(
    Output('table', 'children'),
    [Input('dropzone', 'uploaded_files')])
def handle_uploaded_files(uploaded_files):
    """Handles downstream processes using metadata about the uploaded files from React side."""
    if uploaded_files:
        uploaded_files = json.loads(uploaded_files)[0]
        _id = uploaded_files.get('id')
        # Strip extension from filename
        _filename = os.path.splitext(uploaded_files.get('filename'))[0]

        # Create a dataset
        dataset = g.client.Dataset.get_or_create_by_full_path('~/' + _filename)

        # Import the file into the dataset
        g.client.DatasetImport.create(
            dataset_id=dataset.id,
            object_id=_id
        )

        # Wait until activity is completed
        dataset.activity(follow=True)

        SELECTED_COLS = ['col_a', 'col_b', 'col_c']
        query = dataset.query(fields=SELECTED_COLS)

        return html.Div(
            dt.DataTable(
                id='data-table',
                rows=list(query),
                columns=SELECTED_COLS
            )
        )


# Loading screen CSS
app.css.append_css({
    "external_url": "https://codepen.io/chriddyp/pen/brPBPO.css"
})


if __name__ == '__main__':
    app.run_server(debug=True)
