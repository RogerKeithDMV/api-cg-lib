const axios = require("axios").default;
const {constants, helpers, log} = require('utils-nxg-cg');
const {objecteApiReq,objecteApiOpt} = require('./objects');

module.exports.api = async (msg, cfg, test = false) => {
  let resultApi=null;
    return new Promise(async (resolve, reject) => {
      try {
        log.info('Inside api lib');
        log.debug('Msg=', JSON.stringify(msg));
        log.debug('Config=', JSON.stringify(cfg));
  
        const {data} = msg;
  
        let properties = {...objecteApiReq};
        let extraProp = {...objecteApiOpt};
  
        if (!test && !data) {throw new Error(`${constants.ERROR_PROPERTY} data`);}
  
        const valid = await helpers.validProperties(properties, data, cfg);
  
        if (valid) {
          await helpers.validProperties(extraProp, data, cfg, true);
          properties = {...properties, ...extraProp};
  
          let token="";
          if(properties.auth!=null){
            token = properties.auth.toString();
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
            
             resultApi=await axios({
                method: properties.method.toString(),
                url: properties.api.toString()
            })
            .then(function ({data}) {
                return ({api: data});
            });
            //resultApi=_data;
        }

        log.info(resultApi);
        resolve(resultApi);
      }
      catch (e) {
          log.error(e);
          reject({error:e});
      }
    });
  };