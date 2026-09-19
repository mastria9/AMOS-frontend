<template>
   <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


            <div class="content__header content__boxed overlapping">
                <div class="content__wrap">

                        <!-- Page title and information -->
                        <h1 class="page-title mb-2">Magazzino</h1>
                        <h2 class="h5">Stato del tuo Magazzino</h2>
                        <p></p>
                        <!-- END : Page title and information -->
                </div>
            </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row bg-light p-2">
                    <div class="col-12 d-md-flex justify-content-md-end">
                        <a class="btn btn-warning" @click="this.$router.push('/warehouses?company='+this.company.id)">Tutti i Magazzini</a>
                    </div>
                </div>
            
                <div class="row bg-light mt-2" v-if="this.warehouse">
                    <div class="col-md-6 m-auto">
                        <div class="card ">
                            <div class="card-header">
                                <div class="row">
                                    <div class="col-7">
                                        <h4 class="card-title">{{this.warehouse.code}}</h4>
                                        <p class="card-category"><b>{{this.warehouse.name}}</b></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="table-responsive">
                                            <table class="table">
                                                <tbody>
                                                    <tr><th>VID</th><th>{{this.company.vid}}</th></tr>
                                                    <tr><th>Vendor</th><td>{{this.company.name}}</td></tr>
                                                    <tr><th>Codice Magazzino</th><td>{{this.warehouse.code}}</td></tr>
                                                    <tr><th>Nome</th><td><input class="form-control" type="text" v-model="this.warehouse.name"/></td></tr>
                                                    <tr><th>Indirizzo</th><td><input type="text" class="form-control"  v-model="this.warehouse.address"/></td></tr>
                                                    <tr><th>Provincia</th><td><input type="text" class="form-control" v-model="this.warehouse.province"/></td></tr>
                                                    <tr><th>Nazione</th><td><input type="text" class="form-control" v-model="this.warehouse.country"/></td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 text-right">
                                        <button class="btn btn-success" v-on:click="this.saveWarehouse()">Salva</button>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="card-footer d-md-flex justify-content-md-center m-auto">
                                <button v-if="user.is_superuser" class="btn btn-danger" v-on:click="this.deleteWarehouse()"> !!! Elimina definitivamente !!! </button>
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
            warehouse:null,
            me:{},
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
            
            this.getMe().then(this.getCompanies).then(this.getWarehouse)
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
                    this.toast.error("Errore indefinito (Company)");
                };
        },

        async getWarehouse(){
            try{
                    const res = await this.axios.get("/api/warehouses/"+this.$route.query.id+"/?company="+this.company.id).then((res)=>{
                        this.warehouse=res.data;

                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Magazzubi)");
                };

        },
        
        saveWarehouse(){
            this.axios.put("/api/warehouses/"+this.warehouse.id+"/?company="+this.company.id,this.warehouse).then((res)=>{
                        this.toast.success("Modifiche salvate");
                        this.$router.push("/warehouses/?company="+this.company.id);
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
        },
        
        
        
        
        async getMe(){
            try{
                    const res = await this.axios.get("/api/me/").then((res)=>{
                        this.user=res.data.results[0];
                        if(this.user.is_staff){
                            this.getAllUsers();
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
        
        
        
        
        deleteWarehouse(){
            this.axios.delete("/api/warehouses/"+this.warehouse.id+"/?company="+this.company.id).then((res)=>{
                        this.toast.success("Magazzino eliminato definitivamente");
                        this.$router.go("/warehouses");
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText));
                        }
                    })
        },
        
        changeCompany(key){
            window.location.href='/warehouses/new/?company='+this.companies[key].id;
        }
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
