<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Utenti</h1>
                    <h2 class="h5">Tutti gli utenti (ADMIN)</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row">
                        <div class="col-xl-8">
                            <div class="card ">
                                <div class="card-header">
                                    <div class="row">
                                        <div class="col-6">
                                            <h4 class="card-title">Utenti</h4>
                                            <p class="card-category">Tutti gli utenti</p>
                                        </div>
                                        <div class="col-6 d-md-flex justify-content-md-end m-auto mt-0">
                                            <a href="/users/new/" class="btn btn-primary">Aggiungi utente</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr><th>User</th><th>Nome</th><th>Cognome</th><th>Email</th><th>Tel</th><th>Ultimo login</th><th>Staff</th><th>Stato</th><th></th></tr>
                                                    </thead>
                                                    <tbody>
                                                        
                                                        <tr v-for="(value,key) in this.users" :key="key" :value="value">
                                                            <th>{{value.username}}</th>
                                                            <td>{{value.first_name}}</td>
                                                            <td>{{value.last_name}}</td>
                                                            <td>{{value.email}}</td>
                                                            <td>{{value.phone}}</td>
                                                            <td>{{value._last_login}}</td>
                                                            <td class="text-center">
                                                                <template v-if="value.is_staff"><i title="Attivo" class="bi bi-circle-fill text-success"></i></template>
                                                                <template v-else><i title="Disabilitato" class="bi bi-circle-fill text-danger"></i></template>
                                                            </td>
                                                            <td class="text-center">
                                                                <template v-if="value.is_active"><i title="Attivo" class="bi bi-circle-fill text-success"></i></template>
                                                                <template v-else><i title="Disabilitato" class="bi bi-circle-fill text-danger"></i></template>
                                                            </td>
                                                            <td class="text-right">
                                                                <a :href="'/user?id='+value.id+'&company='+this.company.id" rel="tooltip" class="btn btn-primary" title="Vedi profilo">
                                                                    Vedi
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
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="dashboard" @update:collapse="(collapse=false)"/>
    </div>
    
</template>

<script>
import Sidebar from "../../components/Sidebar.vue";
import Footer from "../../components/Footer.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {
            company:{},
            companies:[],
            users:[],
            user:{}
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
            this.getUsers()
        },
        async getCompanies(){
            try{
                    const res = await this.axios.get("/api/companies/").then((res)=>{
                        this.companies=res.data.results;
                        if(this.companies.length>0){
                            this.company=res.data.results[0];
                            this.changeCompany(0);
                        }
                        else{
                            this.company=null;
                            this.toast.warning("Nessuna azienda registrata");
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
        async getUsers(){
            try{
                    const res = await this.axios.get("/api/users/").then((res)=>{
                        this.users=res.data.results;                        
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
<style scoped>

#left-col{
    position:fixed;
    width:400px;
    right:var(--right-width);
    
  padding: 10px ;
    color: rgb(26, 26, 26);
    min-height:100px;

  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #FFA534, #FFA534) border-box;
    
  border-right : 5px solid transparent;
  border-left : 5px solid transparent;
  border-top : 1px solid transparent;
  border-bottom : 1px solid transparent;
  

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