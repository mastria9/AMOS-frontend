<template>
 <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Permessi</h1>
                    <h2 class="h5">Modifica i permessi dei tuoi Collaboratori</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row mt-2 mb-2 p-2 bg-light">
                        
                        <div class="col-12 d-md-flex justify-content-md-end">
                            <a :href="'/company?id='+this.company.id" class=" m-auto me-0 btn btn-primary" v-on:click="this.$router.go(-1)">Torna alla tua Azienda</a>
                        </div>
                    </div>
                    <div class="row p-2 bg-light">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <div class="row">

                                        <div class="col-6">
                                            <h4 class="card-title">Collaboratori di {{this.company.name}}</h4>
                                            <p class="card-category"><b>{{this.company.vid}}</b></p>
                                        </div>
                                        
                                        <div class="col-6 d-md-flex justify-content-md-end">
                                                <button v-on:click="savePermissions()" class="btn btn-primary m-auto me-0">Salva modifiche</button>
                                            </div>
                                    </div>
                                    </div>
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table table-sm table-borderless">
                                                    <thead><tr><th>User</th><th>Nome</th><th>Cognome</th><th class="base">Messaggi</th><th class="base">Schede Prodotto/Categorie/Attributi</th><th class="base">Gestione Ordini</th><th class="base">Gestione Spedizioni</th><th class="basea">Offerte</th><th class="basea">Inventario</th><th class="baseadmin">Aziende</th><th class="baseadmin">Magazzini</th><th class="baseadmin">Marketplace</th><th class="baseadmin">Corrieri</th><th class="baseadmin">Autorizzazioni</th><th></th><th>Stato</th></tr></thead>
                                                    <tbody>
                                                        <tr v-for="(value,key) in this.authorizations" :key="key" :value="value">
                                                            <th>{{value.username}}</th>
                                                            <td>{{value.first_name}}</td>
                                                            <td>{{value.last_name}}</td>
                                                            <td>
                                                                <a title="Messaggi" href="#" v-on:click="if(value.permissions.messages.val==2){value.permissions.messages.val=0;}else{value.permissions.messages.val++;}">
                                                                    <i v-if="value.permissions.messages.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.messages.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.messages.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Prodotti,categorie e attributi" href="#" v-on:click="if(value.permissions.products.val==2){value.permissions.products.val=0;}else{value.permissions.products.val++;}">
                                                                    <i v-if="value.permissions.products.val == 1" class="bi bi-eye text-info "></i>
                                                                    <i v-else-if="value.permissions.products.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.products.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Ordini" href="#"  v-on:click="if(value.permissions.orders.val==2){value.permissions.orders.val=0;}else{value.permissions.orders.val++;}">
                                                                    <i v-if="value.permissions.orders.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.orders.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.orders.val == 0" class="bi bi-slash-circle-fill text-danger"></i>

                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Spedizioni" href="#" v-on:click="if(value.permissions.shippings.val==2){value.permissions.shippings.val=0;}else{value.permissions.shippings.val++;}">
                                                                    <i v-if="value.permissions.shippings.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.shippings.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.shippings.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Offerte" href="#" v-on:click="if(value.permissions.offers.val==2){value.permissions.offers.val=0;}else{value.permissions.offers.val++;}"><i v-if="value.permissions.offers.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.offers.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.offers.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Inventario" href="#" v-on:click="if(value.permissions.warehouse_item.val==2){value.permissions.warehouse_item.val=0;}else{value.permissions.warehouse_item.val++;}">
                                                                    <i v-if="value.permissions.warehouse_item.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.warehouse_item.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.warehouse_item.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            
                                                            <td>
                                                                <a title="Gestione Aziende" href="#" v-on:click="if(value.permissions.companies.val==2){value.permissions.companies.val=0;}else{value.permissions.companies.val++;}">
                                                                    <i v-if="value.permissions.companies.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.companies.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.companies.val  == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Magazzini" href="#" v-on:click="if(value.permissions.warehouses.val==2){value.permissions.warehouses.val=0;}else{value.permissions.warehouses.val++;}">
                                                                    <i v-if="value.permissions.warehouses.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.warehouses.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.warehouses.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Marketplaces"  href="#" v-on:click="if(value.permissions.marketplaces.val==2){value.permissions.marketplaces.val=0;}else{value.permissions.marketplaces.val++;}">
                                                                    <i v-if="value.permissions.marketplaces.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.marketplaces.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.marketplaces.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Corrieri" href="#" v-on:click="if(value.permissions.couriers.val==2){value.permissions.couriers.val=0;}else{value.permissions.couriers.val++;}">
                                                                    <i v-if="value.permissions.couriers.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.couriers.val== 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.couriers.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a title="Gestione Autorizzazioni" href="#" v-on:click="if(value.permissions.authorizations.val==2){value.permissions.authorizations.val=0;}else{value.permissions.authorizations.val++;}">
                                                                    <i v-if="value.permissions.authorizations.val == 1" class="bi bi-eye text-info"></i>
                                                                    <i v-else-if="value.permissions.authorizations.val == 2" class="bi bi-pencil text-success"></i>
                                                                    <i v-else-if="value.permissions.authorizations.val == 0" class="bi bi-slash-circle-fill text-danger"></i>
                                                                </a>
                                                            </td>
                                                            <td></td>
                                                            <td>
                                                                <a href="#" v-on:click="value.is_active=!value.is_active" >
                                                                    <template v-if="value.is_active"><i title="Attivo" class="bi bi-check text-success"></i></template>
                                                                    <template v-else><i title="Disabilitato" class="bi bi-slash-circle-fill text-danger"></i></template>
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
            company:{},
            
            authorizations:{},
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
            if(this.$route.query.company!=null){
                this.getCompanies().then(this.getCompany).then(this.getUsers).then(this.getMyPermissions)
            }
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
                            this.marketplace.company=this.company.id;
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
        async getCompany(){
            try{
                    const res = await this.axios.get("/api/companies/"+this.$route.query.company+"/").then((res)=>{
                        this.company=res.data;
                        
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Azienda)");
                };

        },
        
        saveCompany(){
            this.axios.put("/api/companies/"+this.company.id+"/",this.company).then((res)=>{
                        this.$router.go();
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
        },
        
        
        getUsers(){
            
            this.axios.get("/api/authorizations/?company="+this.company.id).then((res)=>{
                for(var i=0;i<res.data.results.length;i++){
                    if(!(res.data.results[i].user.id in this.authorizations)){
                        this.authorizations[res.data.results[i].user.id]={}
                        this.authorizations[res.data.results[i].user.id]["username"]=res.data.results[i].user.username;
                        this.authorizations[res.data.results[i].user.id]["first_name"]=res.data.results[i].user.first_name;
                        this.authorizations[res.data.results[i].user.id]["last_name"]=res.data.results[i].user.last_name;
                        this.authorizations[res.data.results[i].user.id]["last_login"]=res.data.results[i].user.last_login;
                        this.authorizations[res.data.results[i].user.id]["email"]=res.data.results[i].user.email;
                        
                        if(res.data.results[i].user.profile!=null){
                            this.authorizations[res.data.results[i].user.id]["phone"]=res.data.results[i].user.profile.phone;
                        }
                        else{
                            this.authorizations[res.data.results[i].user.id]["phone"]=null;
                        }
                        this.authorizations[res.data.results[i].user.id]["is_active"]=res.data.results[i].user.is_active;
                        this.authorizations[res.data.results[i].user.id]["permissions"]={};    
                    }
                    this.authorizations[res.data.results[i].user.id]["permissions"][res.data.results[i].application]={}
                    this.authorizations[res.data.results[i].user.id]["permissions"][res.data.results[i].application]["id"]=res.data.results[i].id;
                    this.authorizations[res.data.results[i].user.id]["permissions"][res.data.results[i].application]["val"]=res.data.results[i].permission;

                }
                
            }).catch((error)=>{
                if(error.response!=null){
                    this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                }
            })
        
        },
        savePermissions(){
            var errors="";
            for(const [key,value] of Object.entries(this.authorizations)){

                for(const [application,obj] of Object.entries(value.permissions)){
                    var perm={};
                    perm["application"]=application;
                    perm["permission"]=obj["val"];
                    
                    this.axios.put("/api/authorizations/"+obj["id"]+"/?company="+this.company.id,perm).then((res)=>{
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                            errors+=String(application)+" "+String(error.response.status)+" "+String(error.response.statusText)+"\n";
                        }
                    })
                }
                
            }
            if(errors.length>0){
                this.toast.error("Alcune autorizzazioni non sono state salvate\n"+errors)
            }
            else{
                this.toast.success("Autorizzazioni salvate");
            }
        },
        changeCompany(key){
            
            window.location.href='/permissions/?company='+this.companies[key].id;
            
        }
        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
<style scoped>

i {
font-size:20px;   
}
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

td,th{
    padding:5px 5px 5px 5px;
    text-align: center;
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
.base{
    border-bottom:1px solid #1e3955 !important;
}
.basea{
    border-bottom:1px solid orange !important;
}
.baseadmin{
    border-bottom:1px solid red !important;
}




</style>