// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

let arrDomain = [ "dsc", "thanhbuoi"];
let hostname = location.hostname.split(".");
let domain = hostname.find(x => arrDomain.includes(x));

// domains name
const DOMAIN_DSC: string = "dsc";
const DOMAIN_THANHBUOI: string = "thanhbuoi";

var envir = {
  production: false,
  company: "TBE",
  title: "CORE TBE",
  name: "TBE",
  namePrint: "",

  gMapKey: "AIzaSyCkR-wl8rYwyb5XhvinbcfZOuFsRV2IFDo",
  tokenFirebase: "AIzaSyAY9k6gMHd_wx-IiLyhzzYdKh_xhpOxKeM",
  urlFirebase: "https://fcm.googleapis.com/fcm/send",

  urlLogo: "",
  apiGeneralUrl: "",
  apiCRMUrl: "",
  apiPostUrl: "",

  hub: {
    centerHubLongName: "",
    centerHubSortName: "",
    poHubLongName: "",
    poHubSortName: "",
    stationHubLongName: "",
    stationHubSortName: "",
  },

  formatDate: "",
  formatDateTable: "",
  formatDateTime: "",
  formatDateTimeTable: "",

  firebase: {
    apiKey: "AIzaSyBwjHPz6q5c0lNukX_9q_UXD3SiviB8cOU",
    authDomain: "dsc-demo-cb5fb.firebaseapp.com",
    databaseURL: "https://dsc-demo-cb5fb.firebaseio.com",
    projectId: "dsc-demo-cb5fb",
    storageBucket: "dsc-demo-cb5fb.appspot.com",
    messagingSenderId: "631002885321"
  }
};

envir = getEnvironment(domain);

function getEnvironment(domainName: string) {
  switch (domainName) {
    // THANHBUOI
    case "THANHBUOI":
      envir.namePrint = "TBE";
      envir.gMapKey = "AIzaSyCkR-wl8rYwyb5XhvinbcfZOuFsRV2IFDo";
      envir.urlLogo = "assets/images/logo/thanhbuoi.png";
      envir.apiGeneralUrl = "http://coreapi-tms.dsc.vn/";
      envir.apiCRMUrl = "http://cusinfoapi-tms.dsc.vn/";
      envir.apiPostUrl = "http://opapi-tms.dsc.vn/";
      envir.formatDate = "YYYY/MM/DD";
      envir.formatDateTable = "yyyy/MM/dd";
      envir.formatDateTime = "YYYY/MM/DD HH:mm";
      envir.formatDateTimeTable = "yyyy/MM/dd HH:mm";

      envir.hub.centerHubLongName = "Trung tâm";
      envir.hub.centerHubSortName = "TT";
      envir.hub.poHubLongName = "Chi nhánh";
      envir.hub.poHubSortName = "CN";
      envir.hub.stationHubLongName = "Kho";
      envir.hub.stationHubSortName = "KHO";
      break;
      
    // THANHBUOI STAGINHG
    case "dsc":
      envir.namePrint = "TBE";
      envir.gMapKey = "AIzaSyCkR-wl8rYwyb5XhvinbcfZOuFsRV2IFDo";
      envir.urlLogo = "/assets/images/logo/thanhbuoi.png";
      envir.apiGeneralUrl = "http://coreapi-tms.dsc.vn/";
      envir.apiCRMUrl = "http://cusinfoapi-tms.dsc.vn/";
      envir.apiPostUrl = "http://opapi-tms.dsc.vn/";
      envir.formatDate = "YYYY/MM/DD";
      envir.formatDateTable = "yyyy/MM/dd";
      envir.formatDateTime = "YYYY/MM/DD HH:mm";
      envir.formatDateTimeTable = "yyyy/MM/dd HH:mm";

      envir.hub.centerHubLongName = "Trung tâm";
      envir.hub.centerHubSortName = "TT";
      envir.hub.poHubLongName = "Chi nhánh";
      envir.hub.poHubSortName = "CN";
      envir.hub.stationHubLongName = "Kho";
      envir.hub.stationHubSortName = "KHO";

      break;
    // DEFAULT
    default:
      envir.namePrint = "TBE";
      envir.gMapKey = "AIzaSyCkR-wl8rYwyb5XhvinbcfZOuFsRV2IFDo";
      envir.urlLogo = "/assets/images/logo/thanhbuoi.png";
      // envir.apiGeneralUrl = "http://localhost:52724/";
      envir.apiGeneralUrl = "http://coreapi-tms.dsc.vn/";
      envir.apiCRMUrl = "http://cusinfoapi-tms.dsc.vn/";
      envir.apiPostUrl = "http://opapi-tms.dsc.vn/";
      //
      envir.formatDate = "YYYY/MM/DD";
      envir.formatDateTable = "yyyy/MM/dd";
      envir.formatDateTime = "YYYY/MM/DD HH:mm";
      envir.formatDateTimeTable = "yyyy/MM/dd HH:mm";

      envir.hub.centerHubLongName = "Trung tâm";
      envir.hub.centerHubSortName = "TT";
      envir.hub.poHubLongName = "Chi nhánh";
      envir.hub.poHubSortName = "CN";
      envir.hub.stationHubLongName = "Kho";
      envir.hub.stationHubSortName = "KHO";

      break;
  }
  return envir;
}

export const environment = envir;
