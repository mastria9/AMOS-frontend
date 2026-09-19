<template>
   <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Categorie</h1>
                    <h2 class="h5">Le tue categorie</h2>
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

                <div class="row p-2 bg-light mt-2">
                        <table class="table table-responsive">
                          <thead>
                          <tr style="text-align: center;"><th>Principale</th><th>Sottocategoria 1</th><th>Sottocategoria 2</th><th>Sottocategoria 3</th><th></th></tr>
                        </thead>
                        <tbody>
                          <template v-for="(category0,key) in this.categories" :key="key">
                            <tr style="text-align: center;">
                              <td>{{category0['title']}}</td><td></td><td></td><td></td><td><button v-on:click="this.expand(category0['id'])" class="btn btn-primary">Info</button></td>
                            </tr>
                            <tr  v-if="this.info[category0['id']]">
                              <td colspan="5">
                                <div class="col-12 card">
                                  <div class="card-header row">
                                    <div class="col-6">
                                      <h6 class="card-title">{{category0['title']}}</h6>
                                      <div class="card-category">{{category0['name']}}</div>
                                    </div>
                                    <div class="col-6 d-md-flex justify-content-md-end">
                                      <a :href="'/category/?company='+this.company.id+'&marketplace='+this.marketplace.id+'&id='+category0['id']" class="btn btn-primary mt-2">Modifica</a>
                                    </div>
                                  </div>
                                  <div class="card-body">
                                      <div class="row col-12">
                                      <div class="col-4">
                                        <div><b>Attributi</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute0,keyattr0) in category0['attributes']" :key="keyattr0">{{attribute0.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Attributi Personalizzati</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute0,keyattr0) in category0['custom_attributes']" :key="keyattr0">{{attribute0.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Variazioni disponibili</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(variation0,keyvary0) in category0['variations']" :key="keyvary0">{{variation0.description}}</li>
                                            <li v-for="(variation0,keyvary0) in category0['custom_variations']" :key="keyvary0">{{variation0.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <hr/>
                                    <div class="row col-12 mt-3">
                                        <div class="col-3">
                                          <div><b>Prodotti semplici associati</b></div>
                                          <ul>
                                            <li v-for="(product0,keyprod0) in category0['simple']" :key="keyprod0">{{product0.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti multipli associati</b></div>
                                          <ul>
                                            <li v-for="(product0,keyprod0) in category0['multiple']" :key="keyprod0">{{product0.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti composti associati</b></div>
                                          <ul>
                                            <li v-for="(product0,keyprod0) in category0['bulk']" :key="keyprod0">{{product0.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti configurabili associati</b></div>
                                          <ul>
                                            <li v-for="(product0,keyprod0) in category0['configurable']" :key="keyprod0">{{product0.sku}}</li>
                                          </ul>
                                        </div>
                            
                                    </div>
                                  </div>
                                
                              </div>
                              </td>
                            </tr>
                            <template v-for="(category1,key1) in category0.childs" :key="key1" >
                              <tr style="text-align: center;" >
                                <td>{{category0['title']}}</td><td>{{category1['title']}}</td><td></td><td></td><td><button v-on:click="this.expand(category1['id'])" class="btn btn-info">Info</button></td>
                              </tr>
                              <tr  v-if="info[category1['id']]">
                                <td colspan="5">
                                <div class="col-12 card border-personal">
                                  <div class="card-body">
                                    <div class="row col-12">
                                      <div class="col-12">
                                        <div><b style="font-size:25px">{{category1['title']}}</b><a :href="'/category/?company='+this.company.id+'&marketplace='+this.marketplace.id+'&id='+category1['id']" class="btn btn-info ml-3">Modifica</a></div>
                                        <div class="card-category">{{category1['name']}}</div>
                                      </div>
                                    </div>
                                      <hr/>
                                      <div class="row col-12">
                                      <div class="col-4">
                                        <div><b>Attributi</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute1,keyattr1) in category1['attributes']" :key="keyattr1">{{attribute1.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Attributi Personalizzati</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute1,keyattr1) in category1['custom_attributes']" :key="keyattr1">{{attribute1.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Variazioni disponibili</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(variation1,keyvary1) in category1['variations']" :key="keyvary1">{{variation1.description}}</li>
                                            <li v-for="(variation1,keyvary1) in category1['custom_variations']" :key="keyvary1">{{variation1.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <hr/>
                                    <div class="row col-12 mt-3">
                                        <div class="col-3">
                                          <div><b>Prodotti semplici associati</b></div>
                                          <ul>
                                            <li v-for="(product1,keyprod1) in category1['simple']" :key="keyprod1">{{product1.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti multipli associati</b></div>
                                          <ul>
                                            <li v-for="(product1,keyprod1) in category1['multiple']" :key="keyprod1">{{product1.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti composti associati</b></div>
                                          <ul>
                                            <li v-for="(product1,keyprod1) in category1['bulk']" :key="keyprod1">{{product1.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti configurabili associati</b></div>
                                          <ul>
                                            <li v-for="(product1,keyprod1) in category1['configurable']" :key="keyprod1">{{product1.sku}}</li>
                                          </ul>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                              </td>
                              </tr>
                              <template v-for="(category2,key2) in category1.childs" :key="key2">
                                <tr style="text-align: center;" v-on:click="this.info[category2['id']]=!this.info[category2['id']]">
                                  <td>{{category0['title']}}</td><td>{{category1['title']}}</td><td>{{category2['title']}}</td><td></td><td><button v-on:click="this.expand(category2['id'])" class="btn btn-info">Info</button></td>
                                </tr>
                                <tr  v-if="info[category2['id']]">
                                  <td colspan="5">
                                <div class="col-12 card border-personal">
                                  <div class="card-body">
                                    <div class="row col-12">
                                      <div class="col-12">
                                        <div><b style="font-size:25px">{{category2['title']}}</b><a :href="'/category/?company='+this.company.id+'&marketplace='+this.marketplace.id+'&id='+category2['id']" class="btn btn-info ml-3">Modifica</a></div>
                                        <div class="card-category">{{category2['name']}}</div>
                                      </div>
                                    </div>
                                      <hr/>
                                      <div class="row col-12">
                                      <div class="col-4">
                                        <div><b>Attributi</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute2,keyattr2) in category2['attributes']" :key="keyattr2">{{attribute2.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Attributi Personalizzati</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute2,keyattr2) in category2['custom_attributes']" :key="keyattr2">{{attribute2.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Variazioni disponibili</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(variation2,keyvary2) in category2['variations']" :key="keyvary2">{{variation2.description}}</li>
                                            <li v-for="(variation2,keyvary2) in category2['custom_variations']" :key="keyvary2">{{variation2.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <hr/>
                                    <div class="row col-12 mt-3">
                                        <div class="col-3">
                                          <div><b>Prodotti semplici associati</b></div>
                                          <ul>
                                            <li v-for="(product2,keyprod2) in category2['simple']" :key="keyprod2">{{product2.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti multipli associati</b></div>
                                          <ul>
                                            <li v-for="(product2,keyprod2) in category2['multiple']" :key="keyprod2">{{product2.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti composti associati</b></div>
                                          <ul>
                                            <li v-for="(product2,keyprod2) in category2['bulk']" :key="keyprod2">{{product2.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti configurabili associati</b></div>
                                          <ul>
                                            <li v-for="(product2,keyprod2) in category2['configurable']" :key="keyprod2">{{product2.sku}}</li>
                                          </ul>
                                        </div>
                                    </div>
                                  </div>
                                
                              </div>
                              </td>
                                </tr>
                                <template v-for="(category3,key3) in category2.childs" :key="key3">
                                  <tr style="text-align: center;" v-on:click="this.info[category3['id']]=!this.info[category3['id']]">
                                    <td>{{category0['title']}}</td><td>{{category1['title']}}</td><td>{{category2['title']}}</td><td>{{category3['title']}}</td><td><button v-on:click="this.expand(category3['id'])" class="btn btn-info">Info</button></td>
                                  </tr>
                                  <tr v-if="info[category3['id']]">
                                    <td colspan="5">
                                <div class="col-12 card border-personal">
                                  <div class="card-body">
                                    <div class="row col-12">
                                      <div class="col-12">
                                        <div><b style="font-size:25px">{{category3['title']}}</b><a :href="'/category/?company='+this.company.id+'&marketplace='+this.marketplace.id+'&id='+category3['id']" class="btn btn-info ml-3">Modifica</a></div>
                                        <div class="card-category">{{category3['name']}}</div>
                                      </div>
                                    </div>
                                      <hr/>
                                      <div class="row col-12">
                                      <div class="col-4">
                                        <div><b>Attributi</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute3,keyattr3) in category3['attributes']" :key="keyattr3">{{attribute3.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Attributi Personalizzati</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(attribute3,keyattr3) in category3['custom_attributes']" :key="keyattr3">{{attribute3.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div class="col-4">
                                        <div><b>Variazioni disponibili</b></div>
                                        <div>
                                          <ul>
                                            <li v-for="(variation3,keyvary3) in category3['variations']" :key="keyvary3">{{variation3.description}}</li>
                                            <li v-for="(variation3,keyvary3) in category3['custom_variations']" :key="keyvary3">{{variation3.description}}</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <hr/>
                                    <div class="row col-12 mt-3">
                                        <div class="col-3">
                                          <div><b>Prodotti semplici associati</b></div>
                                          <ul>
                                            <li v-for="(product3,keyprod3) in category3['simple']" :key="keyprod3">{{product3.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti multipli associati</b></div>
                                          <ul>
                                            <li v-for="(product3,keyprod3) in category3['multiple']" :key="keyprod3">{{product3.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti composti associati</b></div>
                                          <ul>
                                            <li v-for="(product3,keyprod3) in category3['bulk']" :key="keyprod3">{{product3.sku}}</li>
                                          </ul>
                                        </div>
                                        <div class="col-3">
                                          <div><b>Prodotti configurabili associati</b></div>
                                          <ul>
                                            <li v-for="(product3,keyprod3) in category3['configurable']" :key="keyprod3">{{product3.sku}}</li>
                                          </ul>
                                        </div>
                                    </div>
                                  </div>
                                
                              </div>
                              </td>
                                  </tr>
                                </template>
                              </template>
                            </template>
                            
                        </template>
                      </tbody>
                        </table>
                    </div>
                  
                        
                </div>
                </div>
    
    <Footer/>
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
          category:"",
          collapse:false,
            company:{},
            companies:[],
          marketplaces:[],
          marketplace:{},
          info:{},
          abstractProducts:{}
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
            this.getCompanies().then(this.getMarketplaces).then(this.getCategories).then(this.getAbstractProducts)
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
              for(var a=0;a<this.categories.length;a++){
                this.info[this.categories[a].id]=false;
                for(var b=0;b<this.categories[a].childs.length;b++){
                  this.info[this.categories[a].childs[b].id]=false;
                  for(var c=0;c<this.categories[a].childs[b].childs.length;c++){
                    this.info[this.categories[a].childs[b].childs[c].id]=false;
                    for(var d=0;d<this.categories[a].childs[b].childs[c].childs.length;d++){
                      this.info[this.categories[a].childs[b].childs[c].childs[d].id]=false;
                    } 
                  } 
                } 
              } 
            }).catch((error)=>{
                this.toast.error(error);
            })
        
        },

        async getAbstractProducts(){
            this.axios.get("/api/abstract/simple/?company="+this.company.id).then((res)=>{
              this.abstractProducts["simple"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/configurable/?company="+this.company.id).then((res)=>{
              this.abstractProducts["configurable"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/multiple/?company="+this.company.id).then((res)=>{
              this.abstractProducts["multiple"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            })
            this.axios.get("/api/abstract/bulk/?company="+this.company.id).then((res)=>{
              this.abstractProducts["bulk"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            })


        
        },
        
        
        
        changeCompany(key){
            window.location.href='/categories?company='+this.companies[key].id;
            
        },
        changeMarketplace(event){
            window.location.href='/categories?company='+this.company.id+'&marketplace='+event.target.value;
        },
        
       

        searchCategories(value,tree,path=""){
          if(value==""){
            this.paths=[];
            return;
          }
          var re=new RegExp(value.toLowerCase());
          
          for(var i=0; i<tree.length;i++){
            if(tree[i].title.toLowerCase().match(re)){
              this.paths.push({"id":tree[i].id,"path":path+" \\ "+tree[i].title});
            }
            this.searchCategories(value,tree[i].childs,path+" \\ "+tree[i].title);
          }
        },

        
        expand(id){
          for(var key of Object.keys(this.info)){
            if(key==id){
              this.info[id]=!this.info[id];
            }
            else{
              this.info[key]=false;
            }
          }
        }
        

        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}

</script>