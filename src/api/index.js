import { get } from './helpers'
import urlParams from '../common/js/url_params'
const sellerId = urlParams.getUrlKey("sellerId");
const deskId = urlParams.getUrlKey("deskId");
window.sessionStorage.setItem("sellerId",sellerId);
let newSellerId = window.sessionStorage.getItem("sellerId");
window.sessionStorage.setItem("deskId",deskId);
const getSeller = get('/api/seller?sellerId='+newSellerId);
const getGoods = get('/api/goods?sellerId=1')
const getRatings = get('/api/ratings?sellerId=1');
export {
  getSeller,
  getGoods,
  getRatings
}
