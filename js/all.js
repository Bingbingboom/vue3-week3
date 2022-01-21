// ESM
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.23/vue.esm-browser.min.js';

let productModal; // 產品 modal 
let delProductModal; // 刪除 modal

const app = createApp({
  // 資料
  data(){
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/",  // API 網址
      apiPath: "bingbingboom",  // 申請的 API Path
      temp: {},
      products: [],
      newProduct: false,
    }
  },

  // 生命週期
  mounted() {
    // 取出 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log(token);

    // 設定預設夾帶 headers 驗證資訊
    axios.defaults.headers.common['Authorization'] = token;

    // 確認是否登入
    this.checkLogin();

    // 建立 modal 實體
    productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));  
  },

  // 方法
  methods: {
    // 確認是否登入
    checkLogin(){
      axios.post(`${this.apiUrl}/v2/api/user/check`)
      .then((res) => {
        // console.log(res);
        // 未成功登入
        if(!res.data.success){
          alert(res.data.message);
          // 轉址 - 回到登入頁面
          window.location = "login.html";
        }

        // 登入成功，取得產品資料
        this.getData();
      })
      .catch((err) => {
        console.dir(err);
        window.location = "login.html";
      })
    },

    // 取得產品列表
    getData(){
      axios.get(`${this.apiUrl}/v2/api/${this.apiPath}/admin/products`)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.dir(err);
        })
    },

    // 啟用 未啟用
    changeEnabled(item){
      item.is_enabled = !item.is_enabled;
    },

    // 打開 modal 
    openModal(todo, item){
      if(todo === 'new'){
        // console.log('建立產品 Modal');
        this.newProduct = true;
        this.temp = {};
        productModal.show();
      }else if(todo === 'edit'){
        // console.log('編輯產品 Modal');
        this.newProduct = false;
        productModal.show();
        this.temp = {...item};
      }else if(todo === 'del'){
        // console.log('刪除產品 Modal');
        delProductModal.show();
        // console.log({...item});
        this.temp = {...item};
      }
    },

    // 刪除產品
    delProduct(id){
      // console.log(id);
      axios.delete(`${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${id}`)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
          this.temp = {};
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },

    // 更新產品
    updateProduct(id){
      if(this.newProduct){
        // console.log('新增產品');
        axios.post(`${this.apiUrl}/v2/api/${this.apiPath}/admin/product`,{
          data: this.temp
        })
          .then((res) => {
            alert(res.data.message);
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message);
          })
      }else{
        // console.log('編輯產品');
        axios.put(`${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${id}`,{
          data: this.temp
        })
          .then((res) => {
            alert(res.data.message);
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message);
          })
      }
    },

    // 新增圖片
    addImages(){
      this.temp.imagesUrl = [];
      this.temp.imagesUrl.push('');
    },
  }
});

app.mount('#app');