# solvebio-dash-components

This package provides the React component suite for SolveBio-specific Dash components

## Development
### Setup

```sh
# Install JavaScript dependencies
$ npm install

# Create Python 2 virtual environment and install Python dependencies
$ pipenv --two install --dev

# Enter virtual environment
$ pipenv shell

```

Add the following line to your Dash app
```
app.scripts.config.serve_locally = True
```

### Components

To install the SolveBio Dash components locally, simply clone the repo to the root folder of your
Dash app

```sh
$ git clone https://github.com/solvebio/solvebio-dash-components.git
```

Then `cd` into the directory and follow the above setup process.

In addition, add the following lines to your Dash app
```
sys.path.insert(0, 'solvebio-dash-components')
import solvebio_dash_components as sdc
```

#### DashS3Uploader

A working example of the DashS3Uploader component can be launched with the following:

```sh
$ python usage.py
$ open http://local.solvebio.com:8050
```

One thing to note about the DashS3Uploader is that when run locally, it must be run on `local.solvebio.com`
for proper function. This is because the CORS configurations have been set on the server side
so as to only allow S3 uploading specifically from the above address.

### Code quality and tests

#### To run lint and unit tests:

```sh
$ npm test
```

#### To run unit tests and watch for changes:

```sh
$ npm run test-watch
```

#### To run a specific test

In your test, append `.only` to a `describe` or `it` statement:

```javascript
describe.only('Foo component', () => {
    // ...
});
```

### Testing your components in Dash

1. Build development bundle to `lib/` and watch for changes

        # Once this is started, you can just leave it running.
        $ npm start

2. Install module locally (after every change)

        # Generate metadata, and build the JavaScript bundle
        $ npm run install-local

        # Now you're done. For subsequent changes, if you've got `npm start`
        # running in a separate process, it's enough to just do:
        $ python setup.py install

3. Run Dash file containing your component

        $ python usage.py

## Installing Python package locally

Before publishing to PyPi, you can test installing the module locally:

```sh
# Install in `site-packages` on your machine
$ npm run install-local
```

## Uninstalling Python package locally

```sh
$ npm run uninstall-local
```

## Publishing

Currently, separate steps must be taken to publish to NPM and PyPi as this project
is based on the [dash-components-archetype][]. There is ongoing work to simplify
the publishing steps into one workflow [here](https://github.com/plotly/dash-components-archetype/issues/5).

1. Publish to NPM

        # Prepublish
        $ npm run prepublish

        # Bump the package version
        $ vim package.json
        
        # Create new tag
        $ git tag -a vx.x.x -m "tag message"

        # Push branch and tags to repo
        $ git push origin --tags

        # Publish to NPM
        $ npm publish

2. Publish to PyPi

        # Bump the PyPi package to the same version
        $ vim solvebio_dash_components/version.py

        # Commit to github
        $ git add solvebio_dash_components/version.py
        $ git commit -m "Bump pypi package version to vx.x.x"
        
        # Create new dist
        $ python setup.py sdist

        # Publish to PyPi using
        $ twine upload dist/*


## Builder / Archetype

We use [Builder][] to centrally manage build configuration, dependencies, and
scripts.

To see all `builder` scripts available:

```sh
$ builder help
```

See the [dash-components-archetype][] repo for more information.

[Builder]: https://github.com/FormidableLabs/builder
[Dash]: https://plot.ly/dash
[NPM package authors]: https://www.npmjs.com/package/dash-core-components/access
[PyPi]: https://pypi.python.org/pypi
[dash-components-archetype]: https://github.com/plotly/dash-components-archetype
