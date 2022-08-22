const axios = require("axios").default;
const {constants, helpers, log} = require('utils-nxg-cg');
const {objecteApiReq,objecteApiOpt} = require('./objects');

module.exports.api = async (msg, cfg, test = false) => {
  let resultApi=null;
    return new Promise(async (resolve, reject) => {
      try {
        log.info('Inside api lib');
        //log.debug('Msg=', JSON.stringify(msg));
        log.debug('Config=', JSON.stringify(cfg));
  
        const {data} = msg;
  
        let properties = {...objecteApiReq};
        let extraProp = {...objecteApiOpt};
  
        if (!test && !data) {throw new Error(`${constants.ERROR_PROPERTY} data`);}
  
        const valid = await helpers.validProperties(properties, data, cfg);
  
        if (valid) {
          await helpers.validProperties(extraProp, data, cfg, true);
          properties = {...properties, ...extraProp};

          if(properties.auth==null&&properties.authType!=null||properties.auth!=null&&properties.authType==null){
            return reject({error:"If you will use authentication you need to fill auth and authType properties."});
          }
  
          let token="";
          let authType="";

          if(properties.auth!=null&&properties.authType!=null){
            token = properties.auth.toString();
            authType = properties.authType.toString();

            axios.defaults.headers.common['Authorization'] = `${authType} ${token}`;
          }

          if(properties.addData!=null){
            resultApi=await axios({
              method: properties.method.toString(),
              url: properties.api.toString(),
              data: properties.addData
            })
            .then(function ({data}) {
                return ({content: data});
            });
          
          }
          else{
          resultApi=await axios({
            method: properties.method.toString(),
            url: properties.api.toString(),
            data:{}
          })
          .then(function ({data}) {
              return ({content: data});
          });
        }
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