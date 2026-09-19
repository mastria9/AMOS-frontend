<template>
 <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Attributi Personalizzati</h1>
                    <h2 class="h5">Crea un attributo personalizzato</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row">
                  <div class="col-12 row">
                    <div class="mt-4 col-12 card" >
                        <div class="card-body m-auto">
                          <table style="min-width:500px;">
                            <th>Marketplace</th>
                              <td>
                                <select class="form-select" v-model="this.attribute.marketplace">
                                  <template v-for="market,key in this.marketplaces" :key="key">
                                    <option v-if="market.code!='AMZ'"  :value="market.id">{{market._code}} {{market._country}} ({{market.account}})</option>
                                  </template>
                                </select>
                              </td>
                            <tr>
                              <th>Nome/codice</th>
                              <td><input type="text" class="form-control" v-model="this.attribute.name"></td>
                            </tr>
                            <tr>
                              <th>Descrizione (visibile ai clienti)</th>
                              <td><input type="text" class="form-control" v-model="this.attribute.description"></td>
                            </tr>
                            <tr>
                              <th>Tipo</th>
                              <td>
                                <select class="form-select" v-model="this.attribute.type">
                                  <option value="INT">Numero Intero (INT)</option>
                                  <option value="DECIMAL">Numero decimale (DECIMAL)</option>
                                  <option value="BOOLEAN">Booleano (Vero/Falso)</option>
                                  <option value="TEXT">Testo (TEXT)</option>
                                  <option value="URL">URL</option>
                                  <option value="CHAR">Caratteri (CHAR)</option>
                                </select>
                              </td>
                            </tr>
                          </table>
                          <hr/>
                          <button class="btn btn-success " v-on:click="create()">Crea</button><button class="float-right btn btn-danger " v-on:click="this.$router.push('/attributes/?company='+this.company.id)">Annulla</button>
                        </div>
                    </div>
                  </div>          
              </div>
  </div>
</div>
              
  <Footer/>
        </section>
            

        <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="attributes" @update:collapse="(collapse=false)"/>
    </div>
                                      
</template>

<script>
const AUTH_TOKEN = "51fb50cfbedaf479a0080615e77cc82392628a21";
import Sidebar from "../../components/Sidebar.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import Footer from "../../components/Footer.vue";
import { useToast } from "vue-toastification";
function initialState (){
return {  
        
        attribute:{},
        collapse:false,
            company:{},
            companies:[],
        user:null,
        marketplaces:[],
        

        


        
      }
}
export default{
  data(){
      return initialState();
  },
  setup(){
      const toast = useToast();
      return { toast }
  },
mounted(){
      this.init();
  },
  computed:{
  },
methods:{
  
      async init(){
          this.getCompanies().then(this.getMarketplaces)
      },
      async getCompanies(){
        try{
                  const res = await this.axios.get("/api/companies/").then((res)=>{
                      
                      if(res.data.results.length==0){
                          this.toast.warning("Nessuna azienda registrata");
                      }
                      else{
                          this.companies=res.data.results;
                          if(this.$route.query.company){

                              for(var i=0;i<this.companies.length;i++){
                                  if(this.companies[i].id==this.$route.query.company){
                                      this.company=this.companies[i];
                                  }
                              }
                          }
                          else{
                              this.company=this.companies[0];
                          }
                      }
                          

                      
                  }).catch((error)=>{
                      if(error.response!=null){
                      this.toast.error(error.response.data.detail);
                      }
                  })
              }
              catch(error) {
                  this.toast.error("Errore indefinito (Azienda)");
              };

      },
      async getMarketplaces(){
            if(this.company!==null){
                try{
                    const res = await this.axios.get("/api/marketplaces/?company="+this.company.id)
                    this.marketplaces=res.data.results;
                    if(res.data.results.length<=0){
                      this.marketplace=null;
                      this.toast.error("Nessun marketplace");
                    }                        
                }  
                catch (error){
                    this.toast.error("Errore indefinito");
                }  
            }
            
        },
      changeCompany(key){
          window.location.href='/categories?company='+this.companies[key].id;
          
      },
     
      
     

      create(){
        
        
          this.axios.post("/api/products/custom_attributes/?company="+this.company.id+"&marketplace="+this.attribute.marketplace,this.attribute).then((res)=>{
            window.location.href='/attributes/?company='+this.company.id;
            
          }).catch((error)=>{
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                this.toast.error(String(error.message)+"\n"+String(error.response.statusText)+"\n"+String(error.request.response))
                
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              this.toast.error(String(error.request.response))
            } else {
                // Something happened in setting up the request that triggered an Error
                this.toast.error(String(error.message))
            }
            
          });
        
        
        
      },
  },
  components:{Sidebar,HeaderNav,Footer}

  

}

</script>

