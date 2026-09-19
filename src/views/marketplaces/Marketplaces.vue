<template>
   <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Marketplaces</h1>
                    <h2 class="h5">Lista dei Marketplaces</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card ">
                                <div class="card-header">
                                    <div class="row">
                                        <div class="col-6">
                                            <h4 class="card-title">Informazioni sui tuoi punti vendita</h4>
                                            <p class="card-category">Stato dei tuoi Marketplace</p>
                                        </div>
                                        <div class="col-6 d-md-flex justify-content-md-end m-auto">
                                            <a :href="'/marketplaces/new/?company='+this.company.id" v-if="this.user.is_staff" class="btn btn-primary">Aggiungi Marketplace</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <tbody>
                                                        <tr><th>Vendor ID</th><th>Vendor</th><th>Account</th><th>Tipo</th><th>Nazione</th><th>Sito Web</th><th class="text-center">Stato</th><th></th></tr>
                                                        <tr v-for="(marketplace,key) in this.marketplaces" :key="key">
                                                            <td>{{company.vid}}</td>
                                                            <td>{{company.name}}</td>
                                                            <td><b>{{marketplace.account}}</b></td>
                                                            <td>
                                                                
                                                                    <template v-if="marketplace.code=='AMZ'"><b>Amazon</b></template>
                                                                    <template v-else-if="marketplace.code=='EBY'"><b>EBAY</b></template>
                                                                    <template v-else-if="marketplace.code=='NVX'"><b>Nevix</b></template>
                                                                    <template v-else-if="marketplace.code=='WDP'"><b>Wordpress</b></template>
                                                                    <template v-else-if="marketplace.code=='MAG'"><b>Magento</b></template>
                                                                
                                                            </td>    
                                                            
                                                            <td>
                                                                <div class="flag">
                                                                    <img :src="'/src/assets/img/flags/'+marketplace.country+'.png'"/> </div>
                                                                </td>
                                                            <td>{{marketplace.website}}</td>
                                                            <td>
                                                                <template v-if="marketplace.status"><i class="fa fa-circle text-success"></i></template>
                                                                <template v-else><i class="fa fa-circle text-danger"></i></template>
                                                            </td>
                                                            <td class="text-right"><a class="btn btn-warning" title="Vedi" :href="'/marketplace?id='+marketplace.id+'&company='+this.company.id">Vedi</a></td>
                                                        </tr>
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
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
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="company" @update:collapse="(collapse=false)"/>
    </div>
    
</template>

<script>
import Sidebar from "../../components/Sidebar.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import Footer from "../../components/Footer.vue";
import Nav from "../../components/Nav.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {
    collapse:false,
            company:{},
            companies:[],
            marketplaces:[],
            user:{},
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
            this.getCompanies().then(this.getMarketplaces).then(this.getMe())
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
            try{
                    const res = await this.axios.get("/api/marketplaces/?company="+this.company.id).then((res)=>{
                        
                        if(res.data.results.length==0){
                            this.toast.warning("Nessun marketplace registrato");
                        }
                        else{
                            this.marketplaces=res.data.results;
                        }
                            

                        
                    }).catch((error)=>{
                        if(error.response!=null){
                        this.toast.error(error.response.data.detail);
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Marketplaces)");
                };

        },
        
        async getMe(){
            try{
                    const res = await this.axios.get("/api/me/").then((res)=>{
                        this.user=res.data.results[0];
                        if(this.user.is_staff){
                            
                        }
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                        this.toast.error(error.response.data.detail);
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Recupero Utente)");
                };

        },
        changeCompany(key){
            
            window.location.href='/marketplaces?company='+this.companies[key].id;
            
        }

        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>