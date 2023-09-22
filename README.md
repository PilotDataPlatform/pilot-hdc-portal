# Pilot Portal

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)

## Getting Started

### Frontend

This is the front end react application of Indoc Pilot project. The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Prerequisites

- nodejs: ^16.13.2
- npm: ^9.1.2

install both npm and nodejs on `https://nodejs.org/en/`

#### Install dependencies

run `npm i` on the `ROOT/` folder to install all the dependencies.

if you are a developer, please additionally run `npm run prepare` to enable husky hooks

#### Config .env file

| Parameter                            | Description                                                                             | Default |
| ------------------------------------ | --------------------------------------------------------------------------------------- | ------- |
| REACT_APP_PORTAL_PATH                | root path for portal. you also need to update "homepage" in package.json to take effect |         |
| REACT_APP_BRANDING_PATH              | page path for your own branding page. logout/login/session expired                      | /login  |
| REACT_APP_API_PATH                   | backend api endpoint for bff                                                            |
| REACT_APP_UPLOAD_URL                 | backend api endpoint for upload service                                                 |
| REACT_APP_DOWNLOAD_URL_V2            | backend api endpoint for download service v2                                            |
| REACT_APP_DOWNLOAD_URL_V1            | backend api endpoint for download service v1                                            |
| REACT_APP_DOWNLOAD_GR                | url path for greenroom download service                                                 |
| REACT_APP_DOWNLOAD_CORE              | url path for greenroom core service                                                     |
| REACT_APP_DEFAULT_AUTH_URL           | url for keycloak auth                                                                   |
| REACT_APP_KEYCLOAK_REALM             | keycloak realm                                                                          |
| REACT_APP_PLATFORM                   | Platform Name                                                                           | Pilot   |
| REACT_APP_DOMAIN                     | server domain                                                                           |
| REACT_APP_SUPPORT_EMAIL              | user support email address                                                              |
| REACT_APP_XWIKI                      | xwiki path for all document                                                             |
| REACT_APP_DOC_BUCKET                 | public document path url prefix                                                         |
| REACT_APP_SUPERSET_SUBDOMAIN         | choose superset mode from subdomain / subpath                                           |
| REACT_APP_SUPERSET_SUBDOMAIN_BASE    | fill the base domain if REACT_APP_SUPERSET_SUBDOMAIN is true                            |
| REACT_APP_ENABLE_SELF_REGISTRATION   | open the self-registration url                                                          |
| REACT_APP_ORGANIZATION_PORTAL_DOMAIN | your organization domain                                                                |

#### Run the Application

run `npm start` to start the React application. You can access the webpage on `localhost:3000` after it starts.

#### Build a Production Version

run `npm build`. After the compilation completed, the minimized static files are in `./build`. You can use any other backend to serve these files.

#### Terms of Use

The terms of use is in `public/files/terms-of-use.html`

## Acknowledgements
The development of the HealthDataCloud open source software was supported by the EBRAINS research infrastructure, funded from the European Union's Horizon 2020 Framework Programme for Research and Innovation under the Specific Grant Agreement No. 945539 (Human Brain Project SGA3) and H2020 Research and Innovation Action Grant Interactive Computing E-Infrastructure for the Human Brain Project ICEI 800858.
