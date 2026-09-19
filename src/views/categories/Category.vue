<template>
  <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
    <section  class="content" id="content">
      <div class="content__header content__boxed overlapping">
        <div class="content__wrap">
          <!-- Page title and information -->
          <h1 class="page-title mb-2">{{this.category['title']}}</h1>
          <h2 class="h5">Categoria</h2>
          <p></p>
          <!-- END : Page title and information -->
        </div>
      </div>
      <div class="content__boxed">
        <div class="content__wrap">
          <div class="row p-2">
            <div class="d-md-flex justify-content-md-end">
              <button class="float-right btn btn-danger ml-3" v-on:click="remove()">Elimina</button>
            </div>
          </div>
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
              <img class="me-2 " :src="this.marketplaceImg" width="30"/>
              <b>Sei in {{marketplace._code}} {{marketplace._country}} - ({{marketplace.account}})</b>
            </div>
          </div>
          <div class="row mt-2 p-2 bg-light">
            <div class="col-3 p-3">
              <b>Nome categoria</b>
              <input type="text" class="form-control" v-model="this.category.title">
              <b>Codice categoria</b>
              <input type="text" class="form-control" v-model="this.category.name">
              <b>Genitore</b>
              <select class="form-select" v-model="this.parent">
                <option v-for="parent,key in this.pathCategories" :key="key" :value="parent.id">{{parent.title}}</option>
              </select>
              <div class="d-md-flex justify-content-md-end">
                <button class="btn btn-success mt-3" v-on:click="saveHeader()">Salva</button>
              </div>
            </div>
          </div>
        

          <div class="mt-4 row bg-light">
            <div class="card">
              <div class="card-header row bg-light">
                <div class="col-6">
                  <h4 class="card-title">Attributi</h4>
                </div>
                <div class="col-6 d-md-flex justify-content-md-end">
                  <button v-on:click="this.saveAttributes()" class="float-right btn btn-success">Salva</button>
                </div>
              </div>
              <div class="card-body d-flex bg-white">
                  <div class="col-4">
                    <b>Di categoria</b>
                        <ul>
                          <li v-for="(attribute,id) in this.attributes" :key="id"><input type="checkbox" :checked="attribute.checked" v-on:change="this.attributeChange(id)">{{attribute.attribute.description}}</li>
                      </ul>
                  </div>
                  <div class="col-4" v-if="this.marketplace.code!='AMZ'">
                    <b>Personalizzati</b>
                        <ul>
                          <li v-for="(attribute,id) in this.custom_attributes" :key="id"><input type="checkbox" :checked="attribute.checked" v-on:change="this.customAttributeChange(id)">{{attribute.attribute.description}}</li>
                      </ul>
                  </div>
                  <div class="col-4">
                    <b>Variazioni</b>
                        <ul>
                          <li v-for="(attribute,id) in this.variations.attributes" :key="id"><input type="checkbox" :checked="attribute.checked" v-on:change="attribute.checked=!attribute.checked">{{attribute.attribute.description}}</li>
                          <li v-if="this.marketplace.code!='AMZ'" v-for="(attribute,id) in this.variations.custom" :key="id"><input type="checkbox" :checked="attribute.checked" v-on:change="attribute.checked=!attribute.checked">{{attribute.attribute.description}}</li>
                      </ul>
                  </div>
              </div>
            </div>
          </div>


          <div class="mt-5  row" style="height:300px">
            <div class="card">
              <div class="card-header row bg-light">
                <div class="col-6">
                  <h4 class="card-title">Prodotti Semplici</h4>
                </div>
                <div class="col-6 d-md-flex justify-content-md-end">
                  <button class="btn btn-success" v-on:click="this.saveAssociateSimple()">Salva</button>
                </div>
              </div>
              <div class="card-body row bg-white" >
                <div class="col-7" style="height:250px; overflow-y: scroll;">
                  <b>Associati</b>
                  <div>
                    <table class="table table-sm table-borderless table-responsive">
                      <thead><tr><th>SKU</th><th>Codice</th><th>Nome</th><th></th></tr></thead>
                      <tbody>
                        <tr v-for="(product,keyprod) in this.category['simple']" :key="product.id">
                          <td>{{product.sku}}</td>
                          <td><template v-if="product.code">{{product.code}}</template></td>
                          <td><template v-if="product.name">{{product.name}}</template></td>
                          <td><span  class="text-danger text-decoration-underline cursor-pointer" v-on:click="removeSimple(keyprod)">Rimuovi</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-5 row">
                  <div class="col-6">
                    <b>Seleziona e associa </b>
                  </div>
                  <div class="col-6 d-md-flex justify-content-md-end">
                    <button class="btn btn-warning pt-0 pb-0 mb-2 mt-2" v-on:click="joinSimple()">Associa</button>
                  </div>
                  <select class="form-select m-2" style="height:200px;" multiple v-model="simpleNew">
                    <option v-for="(product,keyprod) in this.simple" :value="product.id" :key="keyprod">{{product.sku}} - {{product.title}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5  row" style="height:300px; ">
            <div class="card">
              <div class="card-header row bg-light">
                <div class="col-6">
                  <h4 class="card-title">Prodotti Configurabili</h4>
                </div>
                <div class="col-6 d-md-flex justify-content-md-end">
                  <button class="btn btn-success" v-on:click="this.saveAssociateConfigurable()">Salva</button>
                </div>
              </div>
              <div class="card-body row bg-white">
                <div class="col-7" style="height:250px; overflow-y: scroll;">
                  <b>Associati</b>
                  <div>
                    <table class="table table-sm table-borderless table-responsive">
                      <thead><tr><th>SKU</th><th>Codice</th><th>Nome</th><th></th></tr></thead>
                      <tbody>
                        <tr v-for="(product,keyprod) in this.category['configurable']" :key="product.id">
                          <td>{{product.sku}}</td>
                          <td><template v-if="product.code">{{product.code}}</template></td>
                          <td><template v-if="product.name">{{product.name}}</template></td>
                          <td><span  class="text-danger text-decoration-underline cursor-pointer" v-on:click="removeConfigurable(keyprod)">Rimuovi</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-5 row">
                  <div class="col-6">
                    <b>Seleziona e associa </b>
                  </div>
                  <div class="col-6 d-md-flex justify-content-md-end">
                    <button class="btn btn-warning" v-on:click="joinConfigurable()">Associa</button>
                  </div>
                  <select style="height:200px;" class="form-select m-2" multiple v-model="configurableNew">
                    <option v-for="(product,keyprod) in this.configurable" :value="product.id" :key="keyprod">{{product.sku}} - {{product.title}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5  row" style="height:300px; ">
            <div class="card">
              <div class="card-header row bg-light">
                <div class="col-6">
                  <h4 class="card-title">Prodotti Multipli</h4>
                </div>
                <div class="col-6 d-md-flex justify-content-md-end">
                  <button class="btn btn-success" v-on:click="this.saveAssociateMultiple()">Salva</button>
                </div>
              </div>
              <div class="card-body row bg-white">
                <div class="col-7" style="height:250px; overflow-y: scroll;">
                  <b>Associati</b>
                  <div>
                    <table class="table table-sm table-borderless table-responsive">
                      <thead><tr><th>SKU</th><th>Codice</th><th>Nome</th><th></th></tr></thead>
                      <tbody>
                        <tr v-for="(product,keyprod) in this.category['multiple']" :key="product.id">
                          <td>{{product.sku}}</td>
                          <td><template v-if="product.code">{{product.code}}</template></td>
                          <td><template v-if="product.name">{{product.name}}</template></td>
                          <td><span  class="text-danger text-decoration-underline cursor-pointer" v-on:click="removeMultiple(keyprod)">Rimuovi</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-5 row">
                  <div class="col-6">
                    <b>Seleziona e associa </b>
                  </div>
                  <div class="col-6 d-md-flex justify-content-md-end">
                    <button class="btn btn-warning" v-on:click="joinMultiple()">Associa</button>
                  </div>
                  <select style="height:200px;" class="form-select m-2" multiple v-model="multipleNew">
                    <option v-for="(product,keyprod) in this.multiple" :value="product.id" :key="keyprod">{{product.sku}} - {{product.title}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>


          <div class="mt-5  row" style="height:300px; ">
            <div class="card">
              <div class="card-header row bg-light">
                <div class="col-6">
                  <h4 class="card-title">Prodotti Composti</h4>
                </div>
                <div class="col-6 d-md-flex justify-content-md-end">
                  <button class="ml-3 btn btn-success" v-on:click="this.saveAssociateBulk()">Salva</button>
                </div>
              </div>
              <div class="card-body row bg-white">
                <div class="col-7" style="height:250px; overflow-y: scroll;">
                  <b>Associati</b>
                  <div>
                    <table class="table table-sm table-borderless table-responsive">
                      <thead><tr><th>SKU</th><th>Codice</th><th>Nome</th><th></th></tr></thead>
                      <tbody>
                        <tr v-for="(product,keyprod) in this.category['bulk']" :key="product.id">
                          <td>{{product.sku}}</td>
                          <td><template v-if="product.code">{{product.code}}</template></td>
                          <td><template v-if="product.name">{{product.name}}</template></td>
                        
                          <td><span class="text-danger text-decoration-underline cursor-pointer" v-on:click="removeBulk(keyprod)">Rimuovi</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-5 row">
                  <div class="col-6">
                    <b>Seleziona e associa </b>
                  </div>
                  <div class="col-6 d-md-flex justify-content-md-end">
                    <button class="btn btn-warning" v-on:click="joinBulk()">Associa</button>
                  </div>
                  <select style="height:200px;" class="form-select m-2" multiple v-model="multipleNew">
                    <option v-for="(product,keyprod) in this.bulk" :value="product.id" :key="keyprod">{{product.sku}} - {{product.title}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br/>        
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
          expand:{},
          categories:[],
          category:{},
          collapse:false,
            company:{},
            companies:[],
          marketplaces:[],
          marketplace:{},
          info:{},
          abstractProducts:{
            simple:{},
            bulk:{},
            configurable:{},
            multiple:{},
          },

          attributes:{},
          custom_attributes:{},
          variations:{"attributes":{},"custom":{}},

          simpleNew:[],
          multipleNew:[],
          configurableNew:[],
          bulkNew:[],

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

       simple(){
        var list={}
        if(!("simple" in this.category)){
          return list;
        }
        for(const [key,value] of Object.entries(this.abstractProducts.simple)){
          var exists=false;
          for(var i=0; i<this.category.simple.length;i++){
            if(key==this.category.simple[i].id){
              exists=true;
              break;
            }
          }
          if(exists==false){
            list[key]=value;
          }
        }
        return list;
       },


       multiple(){
        var list={}
        if(!("multiple" in this.category)){
          return list;
        }
        for(const [key,value] of Object.entries(this.abstractProducts.multiple)){
          var exists=false;
          for(var i=0; i<this.category.multiple.length;i++){
            if(key==this.category.multiple[i].id){
              exists=true;
              break;
            }
          }
          if(exists==false){
            list[key]=value;
          }
        }
        return list;
       },
       
       configurable(){
        var list={}
        if(!("configurable" in this.category)){
          return list;
        }
        for(const [key,value] of Object.entries(this.abstractProducts.configurable)){
          var exists=false;
          for(var i=0; i<this.category.configurable.length;i++){
            if(key==this.category.configurable[i].id){
              exists=true;
              break;
            }
          }
          if(exists==false){
            list[key]=value;
          }
        }
        return list;
       },
       
       bulk(){
        var list={}
        if(!("bulk" in this.category)){
          return list;
        }
        for(const [key,value] of Object.entries(this.abstractProducts.bulk)){
          var exists=false;
          for(var i=0; i<this.category.bulk.length;i++){
            if(key==this.category.bulk[i].id){
              exists=true;
              break;
            }
          }
          if(exists==false){
            list[key]=value;
          }
        }
        return list;
       }
       
       

        
    },
	methods:{

        attributeChange(id){
          if(this.attributes[id].checked==true){
            this.variations.attributes[id].checked=false;
            delete this.variations.attributes[id];
          }
          this.attributes[id].checked=!this.attributes[id].checked;
        },
        customAttributeChange(id){
          if(this.custom_attributes[id].checked==true){
            this.variations.custom[id].checked=false;
            delete this.variations.custom[id];
          }
          this.custom_attributes[id].checked=!this.custom_attributes[id].checked;
        },

        removeSimple(key){
          this.category.simple.splice(key,1);
        },
        joinSimple(){
          for(var i=0;i<this.simpleNew.length;i++){
            this.category.simple.push(this.abstractProducts.simple[this.simpleNew[i]]);
          }
          this.simpleNew=[];
        },

        removeMultiple(key){
          this.category.multiple.splice(key,1);
        },
        joinMultiple(){
          for(var i=0;i<this.MultipleNew.length;i++){
            this.category.multiple.push(this.abstractProducts.multiple[this.multipleNew[i]]);
          }
          this.multipleNew=[];
        },

        removeConfigurable(key){
          this.category.configurable.splice(key,1);
        },
        joinConfigurable(){
          for(var i=0;i<this.configurableNew.length;i++){
            this.category.configurable.push(this.abstractProducts.configurable[this.configurableNew[i]]);
          }
          this.configurableNew=[];
        },

        removeBulk(key){
          this.category.bulk.splice(key,1);
        },
        joinBulk(){
          for(var i=0;i<this.bulkNew.length;i++){
            this.category.bulk.push(this.abstractProducts.bulk[this.bulkNew[i]]);
          }
          this.bulkNew=[];
        },

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
            await this.axios.get("/api/simplify/products/categories/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
              this.categories=res.data.results;
              this.pathCategories.push({"id":null,"title":"----------------"})
              for(var a=0;a<this.categories.length;a++){
                this.info[this.categories[a].id]=false;
                if(this.categories[a].id==this.$route.query.id){
                  this.category=this.categories[a];
                  
                }
                else{
                  this.pathCategories.push({"id":this.categories[a].id,"title":this.categories[a].title})
                }
                for(var b=0;b<this.categories[a].childs.length;b++){
                  this.info[this.categories[a].childs[b].id]=false;
                  if(this.categories[a].childs[b].id==this.$route.query.id){
                    this.category=this.categories[a].childs[b];
                  }
                  else{
                    if(this.categories[a].id!=this.category.id){
                      this.pathCategories.push({"id":this.categories[a].childs[b].id,"title":this.categories[a].title+"\\"+this.categories[a].childs[b].title})
                    }
                  }
                  for(var c=0;c<this.categories[a].childs[b].childs.length;c++){
                    this.info[this.categories[a].childs[b].childs[c].id]=false;
                    if(this.categories[a].childs[b].childs[c].id==this.$route.query.id){
                      this.category=this.categories[a].childs[b].childs[c];
                    }
                    else{
                      if(this.categories[a].id!=this.category.id && this.categories[a].childs[b].id!=this.category.id){
                        this.pathCategories.push({"id":this.categories[a].childs[b].childs[c].id,"title":this.categories[a].title+"\\"+this.categories[a].childs[b].title+"\\"+this.categories[a].childs[b].childs[c].title})
                      }
                    }


                    for(var d=0;d<this.categories[a].childs[b].childs[c].childs.length;d++){
                      this.info[this.categories[a].childs[b].childs[c].childs[d].id]=false;
                      if(this.categories[a].childs[b].childs[c].childs[d].id==this.$route.query.id){
                        this.category=this.categories[a].childs[b].childs[c].childs[d];
                      }
                      else{
                        if(this.categories[a].id!=this.category.id && this.categories[a].childs[b].id!=this.category.id && this.categories[a].childs[b].childs[c].id!=this.category.id){
                          this.pathCategories.push({"id":this.categories[a].childs[b].childs[c].childs[d].id,"title":this.categories[a].title+"\\"+this.categories[a].childs[b].title+"\\"+this.categories[a].childs[b].childs[c].title+"\\"+this.categories[a].childs[b].childs[c].childs[d].title})
                        }
                      }
                    } 
                  } 
                } 
              }
              if(this.category.parent!=null){
                this.parent=this.category.parent.id;
              }
              this.getAttributes()
              this.getCustomAttributes()
              
              
            }).catch((error)=>{
                this.toast.error(error);
            })
        
        },
        async getAttributes(){
          this.axios.get("/api/products/attributes/?company="+this.company.id).then((res)=>{
            
              for(var i=0;i<res.data.results.length;i++){
                
                this.attributes[res.data.results[i].id]={"checked":false,'attribute':res.data.results[i]};
                
              }
              
              
              for(var k=0;k<this.category.attributes.length;k++){
                this.attributes[this.category.attributes[k].id]["checked"]=true;
                this.variations.attributes[this.category.attributes[k].id]={"checked":false,'attribute':this.category.attributes[k]}
              }

              
              for(var v=0;v<this.category.variations.length;v++){
                this.variations.attributes[this.category.variations[v].id]["checked"]=true;
              }


            }).catch((error)=>{
                this.toast.error(error);
            })
        },

        async getCustomAttributes(){
          if(this.marketplace.code!="AMZ"){
            this.axios.get("/api/products/custom_attributes/?company="+this.company.id).then((res)=>{
                for(var i=0;i<res.data.results.length;i++){
                  this.custom_attributes[res.data.results[i].id]={"checked":false,'attribute':res.data.results[i]};
                  
                }
                
                for(var k=0;k<this.category.custom_attributes.length;k++){
                    this.custom_attributes[this.category.custom_attributes[k].id]["checked"]=true;
                    this.variations.custom[this.category.custom_attributes[k].id]={"checked":false,'attribute':this.category.custom_attributes[k]};
                }
                for(var v=0;v<this.category.custom_variations.length;v++){
                    this.variations.custom[this.category.custom_variations[v].id]["checked"]=true;
                }
              }).catch((error)=>{
                  this.toast.error(error);
              })
          }
        },

        
        
        

        async getAbstractProducts(){
            this.axios.get("/api/abstract/category/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category.id+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProducts["simple"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category.id+"&limit=100000").then((res)=>{
              this.abstractProducts["configurable"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/multiple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category.id+"&limit=100000").then((res)=>{
              this.abstractProducts["multiple"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            })
            this.axios.get("/api/abstract/bulk/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category.id+"&limit=100000").then((res)=>{
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
        
       

        saveHeader(){
          var data={"name":this.category.name,"title":this.category.title,"parent":this.parent}
          this.axios.put("/api/products/categories/"+this.category.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
            this.toast.success("Salvataggio riuscito")
            
          }).catch((error)=>{
            this.toast.error(error)
          })
        },

        saveAttributes(){
          var data={}
          data["attributes"]=[]
          data["custom_attributes"]=[]
          data["variations"]=[]
          data["custom_variations"]=[]
          for(const [key,value] of Object.entries(this.attributes)){
            if(value.checked){
              data["attributes"].push(value.attribute.id)
            }
          }
          for(const [key,value] of Object.entries(this.custom_attributes)){
            
            if(value.checked){
              data["custom_attributes"].push(value.attribute.id)
            }
          }
          for(const [key,value] of Object.entries(this.variations.attributes)){
            if(value.checked){
              data["variations"].push(value.attribute.id)
            }
          }
          for(const [key,value] of Object.entries(this.variations.custom)){
            if(value.checked){
              data["custom_variations"].push(value.attribute.id)
            }
          }
          this.axios.put("/api/products/categories/"+this.category.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
            this.toast.success("Salvataggio riuscito")
            this.$router.go()
          }).catch((error)=>{
            this.toast.error(error)
          })
        },

        

        

        saveAssociateSimple(){
          var data={}
          data["_simple"]=[]
          for(const [key,value] of Object.entries(this.category.simple)){
            data["_simple"].push(value.id)
            
          }
          this.axios.put("/api/products/categories/"+this.category.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
            this.toast.success("Salvataggio riuscito")
            
          }).catch((error)=>{
            this.toast.error(error)
          })
        },

        saveAssociateConfigurable(){
          var data={}
          data["_configurable"]=[]
          for(const [key,value] of Object.entries(this.category.configurable)){
            data["_configurable"].push(value.id)
            
          }
          this.axios.put("/api/products/categories/"+this.category.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
            this.toast.success("Salvataggio riuscito")
            
          }).catch((error)=>{
            this.toast.error(error)
          })
        },

        saveAssociateMultiple(){
          var data={}
          data["_multiple"]=[]
          for(const [key,value] of Object.entries(this.category.multiple)){
            data["_multiple"].push(value.id)
            
          }
          this.axios.put("/api/products/categories/"+this.category.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
            this.toast.success("Salvataggio riuscito")
            
          }).catch((error)=>{
            this.toast.error(error)
          })
        },

        saveAssociateBulk(){
          var data={}
          data["_bulk"]=[]
          for(const [key,value] of Object.entries(this.category.bulk)){
            data["_bulk"].push(value.id)
            
          }
          this.axios.put("/api/products/categories/"+this.category.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
            this.toast.success("Salvataggio riuscito")
            
          }).catch((error)=>{
            this.toast.error(error)
          })
        },

        remove(){
          this.axios.delete("/api/products/categories/"+this.category.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
            this.toast.success("Categoria eliminata")
            this.$router.push("/categories?company="+this.company.id+"&marketplace="+this.marketplace.id)
          }).catch((error)=>{
            this.toast.error(error)
          })
        }

        
        
        

        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
