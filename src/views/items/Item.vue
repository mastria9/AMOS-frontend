<template>
  <div
    id="root"
    class="root hd--expanded hd--sticky mn--sticky"
    :class="{ 'mn--max': !collapse, 'mn--min': collapse }"
  >
    <section class="content" id="content">
      <div class="content__header content__boxed overlapping">
        <div class="content__wrap">
          <!-- Page title and information -->
          <h1 class="page-title mb-2">Rivedi Articolo</h1>
          <h2 class="h5">Modifica il tuo articolo</h2>
          <p></p>
          <!-- END : Page title and information -->
        </div>
      </div>
      <div class="content__boxed">
          <div class="content__wrap">
            <div class="row p-2 bg-light">
                  <div class="col-12 d-md-flex justify-content-md-end">
                      <a :href="'/items/?company='+this.company.id+'&warehouse='+this.warehouse.id" class="btn btn-primary">Tutti gli articoli</a>
                  </div>
              </div>
              <div class="row p-2 bg-light mt-2">
                  <div class="card col-12 row m-auto p-4">
                      <div class="card-header">
                          <h5 class="card-title">{{ this.item.item_code }} - {{ this.item.name }} </h5>
                          <div class="card-category">Inserisci i dati principali dell'articolo. Carica testi e documenti</div>
                      </div>
                      <div class="card-body m-auto">
                          <div class="row col-12">
                              <div class="col-4">
                                  <table>
                                    <tr>
                                          <th>Magazzino/i</th>
                                          <td>
                                            <template v-for="qty,key in this.item.item_qty" :key="key">
                                              <template v-for="warehouse,index in this.warehouses" :key="index">
                                                <span v-if="warehouse.id==qty.warehouse">{{warehouse.code}} - {{warehouse.name}}<br/></span></template>
                                              </template>
                                              
                                            </td>
                                      </tr>
                                      <tr>
                                          <th>Codice</th>
                                          <td><input type="text" class="form-control" v-model="this.item.item_code"></td>
                                      </tr>
                                      <tr>
                                          <th>Riferimento</th>
                                          <td><input type="text" class="form-control" v-model="this.item.name"></td>
                                      </tr>
                                      <tr>
                                          <th>Peso (gr)</th>
                                          <td><input type="number" class="form-control" v-model="this.item.weight"></td>
                                      </tr>
                                      <tr>
                                          <th>Lunghezza/Profondità (mm)</th>
                                          <td><input type="number" class="form-control" v-model="this.item.length"></td>
                                      </tr>
                                      <tr>
                                          <th>Larghezza (mm)</th>
                                          <td><input type="number" class="form-control" v-model="this.item.width"></td>
                                      </tr>
                                      <tr>
                                          <th>Altezza (mm)</th>
                                          <td><input type="number" class="form-control" v-model="this.item.height"></td>
                                      </tr>
                                      
                                      
                                  </table>
                              </div>
                              <div class="col-8">
                                  <b>Testo</b>
                                      <textarea style="width:100%; height:90%" class="form-control" v-model="this.item.text"></textarea>                                
                                  
                              </div>
                        </div>
                        <hr/>
                      <div class="row mt-4 col-12">
                          <div class="col-4">
                              <div><b>Documentazione<br/><small>Testi,schede tecniche,immagini</small></b></div>
                              <div class="p-2">
                                  <input type="file" v-on:change="this.file=$event.target.files[0]">
                                  <button class="btn btn-primary" v-on:click="if(this.file!=null){this.files.push(this.file)};">Aggiungi File</button>
                              </div>
                          </div>
                          <div class="col-8">
                              <div><b>File aggiunti</b></div>
                              <div v-for="(oldfile,key) in this.item.files" :key="key">
                                  <a href="#" class="hover-delete" v-on:click="this.item.files.splice(key,1)">{{oldfile.path}}</a>
                              </div>
                              <div v-for="(filea,key) in this.files" :key="key">
                                  <a href="#" class="hover-delete" v-on:click="this.files.splice(key,1);">{{filea.name}}</a>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="card-footer row">
                      <div class="col-6 d-md-flex justify-content-md-start">
                          <button class="btn btn-secondary float-right" v-on:click="this.$router.go(-1)"> Annulla </button>

                      </div>
                      <div class="col-6 d-md-flex justify-content-md-end">
                          <button class="btn btn-primary" v-on:click="this.save()">Crea</button>
                      </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </section>

    <HeaderNav
      :company.sync="company"
      :collapse.sync="collapse"
      @update:collapse="this.collapse = !this.collapse"
    />
    <Sidebar
      :collapse.sync="collapse"
      :company.sync="company"
      :companies.sync="companies"
      @update:company="(index) => changeCompany(index)"
      parent="items"
      @update:collapse="collapse = false"
    />
  </div>
</template>

<script>
const AUTH_TOKEN = "51fb50cfbedaf479a0080615e77cc82392628a21";
import Sidebar from "../../components/Sidebar.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import Footer from "../../components/Footer.vue";
import { useToast } from "vue-toastification";
function initialState() {
  return {
    collapse: false,
    warehouse:{},
    warehouses:[],
    company: {},
    companies: [],
    // in questo caso marketplace viene utilizzato come market di destinazione
    item:{
      name:null,
      item_code:null,
      weight:null,
      length:null,
      width:null,
      height:null,
      text:null,
      files:[],   
      
  },
  files_uploaded:[],
  files:[],
  file:null,
  };
}
export default {
  data() {
    return initialState();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.init();
  },
  computed: {
    
  },
  methods: {
    async init() {
      this.getCompanies().then(this.getWarehouses).then(this.getItem)
    },
    async getCompanies() {
      try {
        const res = await this.axios.get("/api/companies/").then((res) => {
            if (res.data.results.length == 0) {
              this.toast.warning("Nessuna azienda registrata");
            } else {
              this.companies = res.data.results;
              if (this.$route.query.company) {
                for (var i = 0; i < this.companies.length; i++) {
                  if (this.companies[i].id == this.$route.query.company) {
                    this.company = this.companies[i];
                  }
                }
              } else {
                this.company = this.companies[0];
              }
            }
          })
          .catch((error) => {
            if (error.response != null) {
              this.toast.error(error.response.data.detail);
            }
          });
      } catch (error) {
        this.toast.error("Errore indefinito (Azienda)");
      }
    },

    changeCompany(index) {
      window.location.href = "/items/new?company=" + this.companies[index].id;
    },
    async getWarehouses(){
          try{
              const res = await this.axios.get("/api/warehouses/?company="+this.company.id).then((res) => {
                  if(res.data.results.length>0){
                      this.warehouses=res.data.results;
                      if(this.$route.query.warehouse){
                          for(var i=0;i<this.warehouses.length;i++){
                              if(this.warehouses[i].id==this.$route.query.warehouse){
                                  this.warehouse=this.warehouses[i];
                              }
                          }
                      }
                      else{
                          this.warehouse=this.warehouses[0];
                      }
                  }
                  else{
                      this.warehouse=null
                  }
                  
          
              });
          }
          catch(error){
              this.toast.error("Nessun magazzino creato");
          }
      },
      async getItem(){
          try{
              const res = await this.axios.get("/api/warehouse/items/"+this.$route.query.id+"/?company="+this.company.id).then((res) => {
                  
                      this.item=res.data;
                      
              });
          }
          catch(error){
              this.toast.error("Errore nel recuperare l'articolo");
          }
      },
    async save(){
      for(let i=0; i<this.files.length;i++){
          let formdata=new FormData()
          formdata.append("item_code",this.item.item_code)
          formdata.append("name",this.item.name)
          formdata.append("file",this.files[i])
          let res = await this.axios.post("/api/warehouse/files/?company="+this.company.id,formdata,{headers:{ 'X-CSRFToken':$cookies.get('csrftoken'), 'Content-Type': 'multipart/form-data','Content-Disposition':'attachment;filename='+this.files[i].name}}).then((res) => {
              this.toast.success("File aggiunto");
              this.files_uploaded.push(res.data.id)
          }).catch((error) => {
            this.toast.error(error.response.data.detail);
          });
      }
      let item={}
      item["company"]=this.item.company
      item["height"]=this.item.height
      item["id"]=this.item.id
      item["inStockQty"]=this.item.inStockQty
      item["item_code"]=this.item.item_code
      item["length"]=this.item.length
      item["name"]=this.item.name
      item["text"]=this.item.text
      item["weight"]=this.item.weight
      item["width"]=this.item.width
      item["files"]=this.files_uploaded
      for(let i=0;i<this.item.files.length;i++){
        item["files"].push(this.item.files[i].id)
      }
      await this.axios.put("/api/warehouse/items/"+this.item.id+"/?company="+this.company.id,item).then((res) => {
         this.toast.success("Articolo salvato");
         
      })
      .catch((error) => {
       this.toast.error(error.response.data.detail);
      });
    },
  },
  components: { Sidebar, HeaderNav, Footer },
};
</script>

<style scoped>
.hover-delete:hover{
  text-decoration: line-through;
  cursor:pointer;
}
</style>