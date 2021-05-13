import { React, Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import apiKey from '../config/config';

// App Components
import SearchForm from './SearchForm';
import Nav from './Nav';
import Gallery from './Gallery';
import NotFound from './NotFound';

class App extends Component {

  constructor() {
    super();

    this.state = {
      // Default 3 Data Sets
      dataCats: [],
      dataDogs: [],
      dataComputers: [],
      
      // Search Data Set
      dataSearchImages: [],
      dataQuerySearchValue: '',

      // Browser History Sync (Back & Forward Buttons)


      // Loading Boolean
      loading: true
    }
  }

  componentDidMount() {
    // Fetch & Store Images For Default 3 Data Sets
    // Cats
    axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=cats&per_page=24&format=json&nojsoncallback=1`)
      .then(response => {
        this.setState(prevState => ({
          ...prevState,
          dataCats: response.data.photos.photo,
          loading: false
        }))
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error)
      })
    ;

    // Dogs
    axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=dogs&per_page=24&format=json&nojsoncallback=1`)
      .then(response => {
        this.setState(prevState => ({
          ...prevState,
          dataDogs: response.data.photos.photo,
          loading: false
        }))
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error)
      })
    ;

    // Computers
    axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=computers&per_page=24&format=json&nojsoncallback=1`)
      .then(response => {
        this.setState(prevState => ({
          ...prevState,
          dataComputers: response.data.photos.photo,
          loading: false
        }))
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error)
      })
    ;

    window.onpopstate = (event) => {
      const pathName = event.path[0].location.pathname;
      const queryString = pathName.slice(pathName.lastIndexOf('/') + 1);
      const queryValue = queryString.charAt(0).toUpperCase() + queryString.slice(1);

      // Briefly Reset Loading
      this.setState(prevState => ({
        ...prevState,
        loading: true
      }))
      
      axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${queryString}&per_page=24&format=json&nojsoncallback=1`)
        .then(response => {
          this.setState(prevState => ({
            ...prevState,
            dataSearchImages: response.data.photos.photo,
            dataQuerySearchValue: queryValue,
            loading: false
          }))

          return (
            <Route exact path={pathName} render={() => <Gallery data={this.state.dataSearchImages} title={queryValue} />} />
          )
        })
        .catch(error => {
          console.log('Error fetching and parsing data', error)
        })
      ;

    }

  }

  handlePerformSearch = (query) => {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&per_page=24&format=json&nojsoncallback=1`;

    // Briefly Reset Loading
    this.setState(prevState => ({
      ...prevState,
      loading: true
    }))

    // Fetch Images Using Query (Value) From Search Field
    axios.get(url)
      .then(response => {
        this.setState(prevState => ({
          ...prevState,
          dataSearchImages: response.data.photos.photo,
          dataQuerySearchValue: query,
          loading: false
        }))
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error)
      })
    ;
  }


  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <SearchForm performSearch={this.handlePerformSearch} />
          <Nav />
          {
            (this.state.loading) ? <p>Loading...</p> :
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/cats" />} />
              <Route exact path="/cats" render={() => <Gallery data={this.state.dataCats} title="Cats" />} />
              <Route exact path="/dogs" render={() => <Gallery data={this.state.dataDogs} title="Dogs" />} />
              <Route exact path="/computers" render={() => <Gallery data={this.state.dataComputers} title="Computers" />} />
              <Route exact path="/search/:id" render={() => <Gallery data={this.state.dataSearchImages} title={this.state.dataQuerySearchValue} />} />
              <Route component={NotFound} />
            </Switch>
          }
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
