# Trip Sorter - Frontend

version: 1.0.0  
author: Seán Crawford

## 1. Initial thoughts/research

- Establishing a data format/structure will be important to ensure the application has fast and efficient access to the required information.
- The results for a given search can be whittled down as the user fills out each step of the form. This will reduce the application load when the 'Search' button is pressed. *(i.e. When the user selects a location in the 'From' select box, some sort of initial filtering could occur)*
- At first glance, [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) seems to be the correct approach to building a shortest path search algorithm. 

## 2. Technologies/dependencies

- [Bootstrap](http://getbootstrap.com) - Allows for rapid development of the UI, as the application is not yet at the final stages of design. A common CSS framework allows for another member of the team to easily jump in and continue the development of the UI.
- [AngularJS](https://angularjs.org) (Typescript) - To create a solid, well structured code base.
- [UnderscoreJS](http://underscorejs.org) - A great utility library.
- [Jasmine](https://jasmine.github.io) - Javascript testing framework.

## 3. UI Improvements

- The the from/to select-box options on the form have been alphabetised. To allow the user to easily scan through the list.
- The Select-boxes and Search-type (Cheapest/Fastest) options are saved in the Store. When the user returns to the form, the form-state is restored. (Although a refresh of the page will reset the data)
- On the results page, where a deal has had a discount applied, I've added the original price in red and with a line through it. This communcates the value of the deal they are being shown.

## 4. Potential areas for improvement

- Select-boxes could be upgraded to autocomplete fields.
- The Store Service could be extended to store information in LocalStorage, so data persists.
- Search history could be stored, so that previous searches are easily accessible.
- Search-type could be added to the results page to avoid having to return to the form to change from 'Cheapest' to 'Fastest'.

## 5. The Project

The following tools are required:

- [NodeJS](http://nodejs.org/) - Javascript enviroment
- [GruntJS](http://gruntjs.com/) - Javascript task runner
- [Sass](http://sass-lang.com/) -  CSS preprocessor

*Ensure these all installed before attempting to continue with any of the commands below.*

#### Installation

Install all NodeJS dependencies

    $ npm install
    
#### Running locally

To run a local server and automatically open the default HTML page with livereload:

    $ grunt serve

#### Running tests

To run all Javascript tests:

    $ grunt jasmine
    
#### Building for deployment

To prepare templates, JS and CSS files for deployment.

    $ grunt build

*Warning: Files produced by this grunt task will need to be viewed from a webserver.*

#### Backup

I've included the 'dist' folder in the repository as a backup for any unforeseen installation issues.
This folder contains the latest version of the project after 'grunt build' was run.



