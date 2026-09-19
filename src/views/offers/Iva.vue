<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }" >
          <section  class="content" id="content" >
  
  
          <div class="content__header content__boxed overlapping">
              <div class="content__wrap">
  
                      <!-- Page title and information -->
                      <h1 class="page-title mb-2">IVA</h1>
                      <h2 class="h5">Imposta le percentuali dell'IVA per Marketplace</h2>
                      <p></p>
                      <!-- END : Page title and information -->
              </div>
          </div>
          <div class="content__boxed" style="height: 80vh; overflow-y: scroll;">
              <div class="content__wrap">
                  
                  
                    <div class="row p-2 bg-light">
                        <div class="col-12">
                            <b>Cambia Marketplace</b>
                             <select class="form-select ml-2" v-on:change="this.changeMarketplace($event)">
                                 <option :selected="market.id==this.marketplace.id" v-for="(market,key) in this.marketplaces" :key="key" :value="market.id">{{market._code}} - {{market._country}} - {{market.account}}</option>
                             </select>
                        </div>
                        
                      </div>
                      
                    
                  <div class="row p-2 mt-2 bg-light" >
                        <div class="col-12 mt-4 pt-4" v-if="loading"><span class="spinner-border  text-warning" role="status"></span></div>
                        <div class="card">
                            <div class="card-header">
                                <button class="btn btn-primary" v-on:click="this.modify=true; this.ivas.push({'code':null,'percentage':null})">Aggiungi</button>
                            </div>
                            <div class="card-body">
                                
                                <table v-if="!loading" class="table table-striped table-sm" >
                                    <thead>
                                    <tr><th>Codice</th><th>Percentuale</th><th></th><th></th></tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(iva,key) in this.ivas" :key="key">
                                        <template v-if="this.modify">
                                            <td><input class="form-control" type="text" v-model="iva.code"></td><td><input class="form-control" type="text" v-model="iva.percentage"></td><td><button class="btn btn-danger" v-on:click="this.remove(key)">Elimina</button></td>
                                            <td><button class="btn btn-primary" v-if="this.modify" v-on:click="this.save(key)">Salva</button></td>
                                        </template>
                                        <template v-else>
                                            <td>{{iva.code}}</td><td>{{iva.percentage}}</td>
                                        </template>
                                    </tr>
                                    
                                </tbody>
                            </table>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-6">
                                        <button class="btn btn-primary" v-if="!this.modify" v-on:click="this.modify=!this.modify">Modifica</button>
                                        <button class="btn btn-primary" v-if="this.modify" v-on:click="this.$router.go()">Annulla</button>
                                        
                                    </div>
                                        
                                </div>
                            </div>
                        </div>
                  </div>
              </div>
             
              
      </div>
      <Footer/>
          </section>
              
  
          <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
          <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="iva" @update:collapse="(collapse=false)"/>
      </div>
  
  </template>
  
  <script>
  
  import Sidebar from "../../components/Sidebar.vue";
  import Footer from "../../components/Footer.vue";
  import HeaderNav from "../../components/HeaderNav.vue";
  import { useToast } from "vue-toastification";
  function initialState (){
    return {
  
              
              collapse:false,
              search:"",
              ivas:[],
              marketplaces:[],
              marketplace:"",
              
              company:{},
              companies:[],
              
              loading:false,
                modify:false,
  
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
              this.getCompanies().then(this.getMarketplaces).then(this.getIvas)
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
                      })
                  }
                  catch(error) {
                      if(error.response!=null){
                          this.toast.erroritem_code=models.CharField(max_length=50)(error.response.data.detail);
                      }
                      else{
                          this.toast.error("Errore indefinito");
                      }
                  };
  
          },
         
        async getIvas() {
            try{
               

                    await this.axios.get("/api/ivas/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&limit=1000&offset=0").then((res) => {
                        this.ivas=res.data.results
                        this.loading=false;                        
                    });
            }
            catch(error){
                this.toast.error("Errore indefinito");
            }
        
            
        },
        
          async getMarketplaces(){
            if(this.company!==null){
                try{
                    const res = await this.axios.get("/api/marketplaces/?company="+this.company.id)
                    this.marketplaces=res.data.results;
                    if(this.$route.query.marketplace){
                        for(var i=0;i<this.marketplaces.length;i++){
                            if(this.marketplaces[i].id==this.$route.query.marketplace){
                                this.marketplace=this.marketplaces[i];
                            }
                        }

                    }
                    else{
                        this.marketplace=this.marketplaces[0]
                    }
                    
                }  
                catch (error){
                    this.toast.error("Errore indefinito");
                }  
            }
            
        },
        remove(key){
            if(this.ivas[key].id){
                this.axios.delete('/api/ivas/'+this.ivas[key].id+'/?company='+this.company.id).then((res)=>{
                    this.$router.go()
                })
            }
            else{
                this.ivas.splice(key,1)
            }
        },
          

        save(key){
            if(this.ivas[key].id){
                this.axios.put('/api/ivas/'+this.ivas[key].id+'/?company='+this.company.id+'&marketplace='+this.marketplace.id,this.ivas[key]).then((res)=>{
                    this.toast.success("Salvato")
                })
            }
            else{
                this.ivas[key]["marketplace"]=this.marketplace.id
                this.ivas[key]["company"]=this.company.id
                this.axios.post('/api/ivas/?company='+this.company.id,this.ivas[key]).then((res)=>{
                    this.ivas[key]=res.data;
                    this.toast.success("Salvato")
                })
            }
        },


         
  
          
          changeCompany(key){
               
              window.location.href='/ivas/?company='+this.companies[key].id+'&marketplace='+this.marketplace.id;
               
          },
          
          changeMarketplace(event){
               
               window.location.href='/ivas/?company='+this.company.id+'&marketplace='+event.target.value;
                
           },



  
      },
      components:{Sidebar,HeaderNav,Footer}
  
  
      
  
  }
  </script>
  <style scoped>
  
  .hwfix{
      width:660px;
  }
  .hwfixsmall{
      width:150px;
  }
  .bi{
    font-size:1.5rem;
  }
  td{
      padding:5px 5px 5px 5px;
  }
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(500px);
    opacity: 0;
  }
  .z-9{
      z-index:999999;
  }
  </style>