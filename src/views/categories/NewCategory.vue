<template>
  <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Nuova categoria</h1>
                    <h2 class="h5">Crea una nuova categoria</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
              <div class="row p-2 bg-light">
                    <div class="col-3">
                        <b>Cambia Marketplace</b>
                        <select class="form-select ml-2" v-on:change="changeMarketplace($event)">
                          <option :selected="market.id==this.marketplace.id" v-for="(market,key) in this.marketplaces" :key="key" :value="market.id">{{market._code}} - {{market._country}} - {{market.account}}</option>
                        </select>
                      </div>
                    </div>
                    <div class="p-2 row bg-light">
                      <div class="col-6">
                        <img class="me-2 " :src="marketplaceImg" width="30"/>
                        <b>Sei in {{marketplace._code}} {{marketplace._country}} - ({{marketplace.account}})</b>
                      </div>
                      <div class="col-6 d-md-flex justify-content-md-end">
                        <a class="btn btn-primary" :href="'/categories/new/?company='+this.company.id+'&marketplace='+this.marketplace.id">Nuova</a>
                      </div>
                    </div>
                
                      
                     
                  <div class="col-12 row">
                    <div class="mt-4 col-12 card" >
                      <div class="card-header">
                        <div class="card-title">{{this.category['title']}}</div>
                        <div class="card-category">{{this.category['name']}}</div>
                      </div>
                        <div class="card-body m-auto">
                          <table style="min-width:500px;">
                            <tr>
                              <th>Nome categoria</th>
                              <td><input type="text" class="form-control" v-model="this.category.title"></td>
                            </tr>
                            <tr>
                              <th>Codice categoria</th>
                              <td><input type="text" class="form-control" v-model="this.category.name"></td>
                            </tr>
                            <tr>
                              <th>Genitore</th>
                              <td>
                                <select class="custom-select" v-model="this.parent">
                                  <option v-for="parent,key in this.pathCategories" :key="key" :value="parent.id">{{parent.title}}</option>
                                </select>
                              </td>
                            </tr>
                          </table>
                          <hr/>
                          <button class="btn btn-success " v-on:click="create()">Crea</button><button class="float-right btn btn-danger " v-on:click="this.$router.push('/categories?company='+this.company.id+'&marketplace='+this.marketplace.id)">Annulla</button>
                        </div>
                    </div>


                  

                          

                         

                
              
                  </div>          
              </div>
  </div>  <Footer/>
        </section>
            

        <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="categories" @update:collapse="(collapse=false)"/>
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
        
        categories:[],
        category:{},
        collapse:false,
            company:{},
            companies:[],
        marketplaces:[],
        marketplace:{},
        

        

        pathCategories:[],
        parent:null,

        
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
          this.getCompanies().then(this.getMarketplaces).then(this.getCategories)
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
                  if(res.data.results.length>0){
                      if(this.$route.query.marketplace!=null){
                          for(var i=0; i<res.data.results.length;i++){
                              if(res.data.results[i].id==this.$route.query.marketplace){
                                  this.marketplace=res.data.results[i];
                              }
                          }
                      }
                      else{
                          this.marketplace=res.data.results[0];
                      }
                      this.marketplaceImg="/imgs/"+this.marketplace.code+".png"
                  }
                  else{
                      this.marketplace=null;
                      this.toast.error("Nessun marketplace");
                  }
              }  
              catch (error){
                  this.toast.error("Errore indefinito");
              }  
          }
      },
      
      
      async getCategories(){
          this.axios.get("/api/simplify/products/categories/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
            this.categories=res.data.results;
            this.pathCategories.push({"id":null,"title":"----------------"})
            for(var a=0;a<this.categories.length;a++){
              
                this.pathCategories.push({"id":this.categories[a].id,"title":this.categories[a].title})
              for(var b=0;b<this.categories[a].childs.length;b++){
                this.pathCategories.push({"id":this.categories[a].childs[b].id,"title":this.categories[a].title+"\\"+this.categories[a].childs[b].title})
                for(var c=0;c<this.categories[a].childs[b].childs.length;c++){
                  this.pathCategories.push({"id":this.categories[a].childs[b].childs[c].id,"title":this.categories[a].title+"\\"+this.categories[a].childs[b].title+"\\"+this.categories[a].childs[b].childs[c].title})
                  for(var d=0;d<this.categories[a].childs[b].childs[c].childs.length;d++){
                      this.pathCategories.push({"id":this.categories[a].childs[b].childs[c].childs[d].id,"title":this.categories[a].title+"\\"+this.categories[a].childs[b].title+"\\"+this.categories[a].childs[b].childs[c].title+"\\"+this.categories[a].childs[b].childs[c].childs[d].title})
                  } 
                } 
              } 
            }
            
          }).catch((error)=>{
              this.toast.error(error);
          })
      
      },
      
      changeCompany(key){
          window.location.href='/categories?company='+this.companies[key].id;
          
      },
      changeMarketplace(event){
          window.location.href='/categories/new?company='+this.company.id+'&marketplace='+event.target.value;
      },
      
     

      create(){
        var data={"name":this.category.name,"title":this.category.title,"parent":this.parent}
        this.axios.post("/api/products/categories/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
          window.location.href='/category/?company='+this.company.id+'&marketplace='+this.marketplace.id+'&id='+res.data['id'];
          
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
