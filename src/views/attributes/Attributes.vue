<template>
   <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Attributi</h1>
                    <h2 class="h5">Tutti gli attributi</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                
                    <div class="col-12 card mt-5">
                      <div class="card-header">
                        <div class="card-title">Attributi<a v-if="this.user && this.user.is_staff" href="/attributes/new" class="float-right btn btn-success">Nuovo</a></div>
                      </div>
                      <div class="card-body">
                        <table class="table table-sm">
                          <thead>
                          <tr><th>Nome</th><th>Descrizione</th><th>Tipo</th><th></th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="(attribute,key) in this.attributes" :key="key">
                              <td>{{attribute['name']}}</td>
                              <td>{{attribute['description']}}</td>
                              <td>{{attribute['type']}}</td>
                              <td v-if="this.user.is_staff"><a class="btn btn-primary" :href="'/attribute?company='+this.company.id+'&id='+attribute['id']">Modifica</a></td>
                            </tr>
                      </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="col-12 card mt-5">
                      <div class="card-header">
                        <div class="card-title">Attributi personalizzati<a :href="'/attributes/custom/new?company='+this.company.id" class="float-right btn btn-success">Nuovo</a></div>
                      </div>
                      <div class="card-body">
                        <table class="table table-sm">
                          <thead>
                          <tr><th>Nome</th><th>Descrizione</th><th>Tipo</th><th>Marketplace</th><th></th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="(attribute,key) in this.custom_attributes" :key="key">
                              <td>{{attribute['name']}}</td>
                              <td>{{attribute['description']}}</td>
                              <td>{{attribute['type']}}</td>
                              <td>
                                <template v-for="market,key in this.marketplaces" :key="key">
                                  <template v-if="market.id==attribute['marketplace']">{{market._code}} {{market._country}} ({{market.account}})</template>
                                </template>
                              </td>
                              <td><a class="btn btn-primary" :href="'/attribute/custom?company='+this.company.id+'&id='+attribute['id']">Modifica</a></td>
                            </tr>
                      </tbody>
                        </table>
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
          
    collapse:false,
            company:{},
            companies:[],
          marketplaces:[],
          marketplace:{},
          attributes:{},
          custom_attributes:{},
          user:null, 
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
            this.getCompanies().then(this.getMarketplaces).then(this.getMe).then(this.getAttributes).then(this.getCustomAttributes)
        },
    async getMe(){
            try{
                    const res = await this.axios.get("/api/me/").then((res)=>{
                        this.user=res.data.results[0];
                        
                        
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
            window.location.href='/attributes?company='+this.companies[key].id;
            
        },
        
        async getAttributes(){
          this.axios.get("/api/products/attributes/?company="+this.company.id).then((res)=>{
            this.attributes=res.data.results
            }).catch((error)=>{
                this.toast.error(error);
            })
        },

        async getCustomAttributes(){
            this.axios.get("/api/products/custom_attributes/?company="+this.company.id).then((res)=>{
                  this.custom_attributes=res.data.results
              }).catch((error)=>{
                  this.toast.error(error);
              })
        },
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}

    

}

</script>

