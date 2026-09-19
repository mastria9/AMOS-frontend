<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Aziende</h1>
                    <h2 class="h5">Stato delle tue Aziende</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row">
                        <div class="col-xl-12 mb-3 mb-xl-0">
                            <div class="card h100">
                                <div class="card-header d-flex align-items-center border-0">
                                    <div class="row">
                                        <div class="col-md-12 d-flex gap-1 align-items-center mb-3">
                                    <a href="/companies/new/" v-if="this.user.is_staff" class="btn btn-primary hstack gap-2 align-self-center">
                                        <i class="demo-psi-add fs-5"></i>
                                         Nuova azienda</a>
                                    </div>
                                    </div>
                                </div>
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <tbody>
                                                        <tr><th></th><th>Vendor ID</th><th>Vendor</th><th>Rag. Sociale</th><th>P.IVA</th><th>PEC</th><th>SDI</th><th class="text-center">Stato</th><th></th></tr>
                                                        <tr v-for="(company,key) in this.companies" :key="key">
                                                            <td>
                                                                <div class="flag">
                                                                    <img :src="'/src/assets/img/flags/'+company.country+'.png'"/> </div>
                                                            </td>
                                                            <td><a title="Vedi" :href="'/company?id='+company.id"><b>{{company.vid}}</b></a></td>
                                                            <td><template v-if="company.vendor">{{company.vendor.username}}</template></td>
                                                            <td>{{company.name}}</td>
                                                            <td>{{company.vat}}</td>
                                                            <td>{{company.pec}}</td>
                                                            <td>{{company.sdi}}</td>
                                                            <td class="text-center">
                                                                <template v-if="company.active"><i class="fa fa-circle text-success"></i></template>
                                                                <template v-else><i class="fa fa-circle text-danger"></i></template>
                                                            </td>
                                                            <td>
                                                                <a title="Vedi" :href="'/company?id='+company.id" type="button" class="btn btn-icon btn-primary rounded-circle">
                                                                    <i class="bi bi-eye icon-lg fs-5"></i>
                                                                </a>
                                                            </td>
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
import { useToast } from "vue-toastification";
function initialState (){
  return {
            collapse:false,
            company:{},
            companies:[],
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
            this.getCompanies().then(this.getVendors).then(this.getMe())
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
        async getVendors(){
            try{
                for(var i=0; i<this.companies.length;i++){
                    if(this.companies[i].vendor!=null){
                        const usres = await this.axios.get("/api/users/"+this.companies[i].vendor+"/").then(userres=>{
                            this.companies[i].vendor=userres.data;
                        });
                    
                    }
                }
            }
            catch(error) {
                this.toast.error("Errore indefinito (Azienda)");
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
                    this.toast.error("Errore indefinito (Azienda)");
                };

        },
        

        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
