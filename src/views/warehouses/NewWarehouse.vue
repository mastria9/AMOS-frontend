<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


            <div class="content__header content__boxed overlapping">
                <div class="content__wrap">

                        <!-- Page title and information -->
                        <h1 class="page-title mb-2">Magazzino</h1>
                        <p><br/></p>
                        <p></p>
                        <!-- END : Page title and information -->
                </div>
            </div>
            <div class="content__boxed">
                <div class="content__wrap">
                    <div class="row bg-light p-2">
                        <div class="col-12 d-md-flex justify-content-md-end m-auto">
                            <a :href="'/warehouses/?company='+this.company.id" class="btn btn-primary">Tutti i magazzini</a>
                        </div>
                    </div>
                    <div class="row bg-light p-2">
                        <div class="col-md-6 m-auto">
                            <div class="card p-2">
                                <div class="card-header">
                                    <h4 class="card-title">Aggiungi un nuovo Magazzino</h4>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table table-company">
                                                    <tbody>
                                                        <tr><th>Nome</th><td><input class="form-control" placeholder="Nome del tuo magazzino" type="text" v-model="this.warehouse.name"/></td></tr>
                                                        <tr><th>Indirizzo</th><td><input class="form-control" placeholder="Indirizzo del tuo magazzino" type="text" v-model="this.warehouse.address"/></td></tr>
                                                        <tr><th>Provincia</th><td><input class="form-control" placeholder="Provincia del tuo magazzino" type="text" v-model="this.warehouse.province"/></td></tr>
                                                        <tr><th>Nazione</th><td><input class="form-control" placeholder="Nazione del tuo magazzino" type="text" v-model="this.warehouse.country"/></td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-info" v-on:click="this.$router.go(-1)">Annulla</button>
                                        </div>
                                        <div class="col-6 d-flex justify-content-md-end">
                                            <button class="btn btn-danger" v-on:click="this.addWarehouse()">Aggiungi</button>
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
            warehouse:{
                company:null,
                country:null,
                name:null,
                address:null,
                province:null,
            },
            me:null,
            
            
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
            this.getCompanies().then(this.getMe())
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
                    this.toast.error("Errore indefinito (Magazzino)");
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
        addWarehouse(){
            this.warehouse.company=this.company.id
            this.axios.post("/api/warehouses/?company="+this.company.id,this.warehouse).then((res)=>{
                        this.toast.success("Magazzino aggiunto");
                        this.$router.push("/warehouses?company="+this.company.id);
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText));
                           
                        }
                    })
        },

        
        changeCompany(key){
            
            window.location.href='/warehouses/new?company='+this.companies[key].id;
            
        }
        
        
        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}

    

}
</script>