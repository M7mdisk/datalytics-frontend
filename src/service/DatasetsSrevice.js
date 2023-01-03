import {axios} from axios
export default class DatasetsService {

    getDatasets(){
        var config = {
            method: 'get',
            url: 'http://localhost:8000/api/datasets/',
            headers: { 
              'Authorization': 'Token '+window.localStorage.getItem('Token')
            }
          };
          
         return axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}
