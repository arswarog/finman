## File structure

### Data layer
* Models
    * Directory: [[models]]
    * Using PascalCase
* Atoms
    * Directory: [[atoms]]
    * Using camelCase with a postfix **Atom**
* Store
    * Directory: [[store]]
* Sagas
    * Helpers
        * Directory: [[sagas/helpers]]
        * Methods of exported object **Helpers**
    * Utils
        * Directory: [[sagas/utils]]
        * Methods of exported object **Utils**
    * Sagas
        * Directory: [[sagas/sagas]]
        * Using camelCase with a postfix **Saga**
    * Ui sagas
        * Directory: [[sagas/ui]]
        * Using camelCase with a postfix **UiSaga**
* Database
    * Initials data
        * Directory: [[db/data]]
    * Database schemas
        * Directory: [[db/schemes]]
        * Using PascalCase with a postfix **Scheme**
    * Handlers 
        
        Reactions on actions
        
        Self registered by [[addActionHandler]]
        * Directory: [[db/handlers]]

### View layer
* Routes
    * Directory: [[routes]]
    * Using camelCase
* Atoms for view
    * Directory: [[atoms]]
    * Using camelCase with a postfix **ViewAtom**
* Pages
    * Directory: [[pages]]
    * Using PascalCase with a postfix **Page**
* Widgets
    * Directory: [[widgets]]
    * Using PascalCase with a postfix **Widget**
* Components
    * Directory: [[components]]
    * Using PascalCase
    
### UI kit
* Directory: [[ui-kit]]
* Using PascalCase

### Other
* Hooks
    * Directory: [[hooks]]
    * Using PascalCase with a prefix **use**
* Helpers like library
    * Directory: [[hooks]]
* Service worker files
    * Directory: [[service-worker]]
    
### Documentation
All documentation in **/docs**
