<template>
     <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Aziende</h1>
                    <h2 class="h5">Aggiungi una nuova azienda</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                    

                    <div class="row">
                        <div class="col-xl-12 mb-3 mb-xl-0">
                            <div class="card col-md-6 m-auto">
                                <div class="card-header">
                                    <h4 class="card-title">Compila i campi</h4>
                                    
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <tbody>
                                                        <tr><th>Rag. Sociale</th><td><input class="form-control" type="text" v-model="newCompany.name"/></td></tr>
                                                        <tr><th>P.IVA</th><td><input class="form-control" type="text" max="20" v-model="newCompany.vat"/></td></tr>
                                                        <tr><th>Indirizzo</th><td><input class="form-control"  type="text" v-model="newCompany.address"/></td></tr>
                                                        <tr><th>Città</th><td><input class="form-control" type="text" v-model="newCompany.city"/></td></tr>
                                                        <tr><th>CAP</th><td><input class="form-control" type="text" max="5" v-model="newCompany.cap"/></td></tr>
                                                        <tr><th>Provincia</th><td><input class="form-control" maxlength="2" style="text-transform:uppercase" type="text" v-model="newCompany.province"/></td></tr>
                                                        <tr><th>Nazione <img v-if="newCompany.country!=null" class="ml-2" :src="'/src/assets/img/flags/'+newCompany.country+'.png'"/></th><td>
                                                            <select class="form-select" v-model="newCompany.country">
                                                                <option selected value="IT">Italia</option>
                                                                <option value="DE">Germania</option>
                                                                <option value="ES">Spagna</option>
                                                                <option value="FR">Francia</option>
                                                            </select>
                                                        </td></tr>
                                                        <tr><th>PEC</th><td><input class="form-control" type="email" v-model="newCompany.pec"/></td></tr>
                                                        <tr><th>SDI</th><td><input class="form-control" type="text" maxlength="7" v-model="newCompany.sdi"/></td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div class="row">
                                        <div class="col-6 text-left">
                                            <button class="btn btn-info" v-on:click="this.$router.go(-1)">Annulla</button>
                                        </div>
                                        <div class="col-6 text-right">
                                            <button class="btn btn-danger" v-on:click="this.addCompany()">Aggiungi</button>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <!-- <div class="card ">
                                <div class="card-header ">
                                    <div class="row">
                                        <div class="col-6">
                                            <h4 class="card-title">Collaboratori</h4>
                                        </div>
                                        <div class="col-6 text-right">
                                            <a :href="'/permissions/?company='+this.company.id" class="btn btn-info">Modifica permessi</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr><th>User</th><th>Nome</th><th>Cognome</th><th>Email</th><th>Tel</th><th>Ultimo login</th><th class="text-center">Stato</th><th></th></tr>
                                                    </thead>
                                                    <tbody>
                                                        
                                                        <tr v-for="(value,key) in this.authorizations" :key="key" :value="value">
                                                            <th>{{value.username}}</th>
                                                            <td>{{value.first_name}}</td>
                                                            <td>{{value.last_name}}</td>
                                                            <td>{{value.email}}</td>
                                                            <td>{{value.phone}}</td>
                                                            <td>{{value.last_login}}</td> 
                                                            <td class="text-center">
                                                                <template v-if="value.is_active"><i title="Attivo" class="fa fa-circle text-success"></i></template>
                                                                <template v-else><i title="Disabilitato" class="fa fa-circle text-danger"></i></template>
                                                            </td>
                                                            <td class="text-right">
                                                                <a :href="'/user?id='+key+'&company='+this.company.id" rel="tooltip" class="btn btn-warning" title="Vedi profilo">
                                                                    <i class="fa fa-user"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->
                        </div></div>
                        </div>
            </div>
           <Footer/>
        </section>
        <HeaderNav  :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
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
            newCompany:{
                name:null,
                address:null,
                city:null,
                cap:null,
                province:null,
                country:null,
                pec:null,
                sdi:null,
                vat:null,
            },
            user:{
                username:null,
                first_name:null,
                last_name:null,
                profile:{
                    phone:null,
                },
                email:null,
            },
            company:{},
            companies:[],
            
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
        
    },
    computed:{
        
        
        },
	methods:{
        
        addCompany(){
            this.axios.post("/api/companies/",this.company).then((res)=>{
                        this.toast.success("Azienda aggiunta");
                        this.$router.push("/companies");
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText));
                            var message="";
                            for(const [field,value] of Object.entries(error.response.data)){
                                message+=String(field)+" ";
                                for(var i=0;i<value.length; i++){
                                    message+=String(value[i])+" ";
                                }
                                message+="\n";
                            }
                            this.toast.error(message);
                        }
                    })
        },

        addUser(){
            this.axios.post("/api/users/",this.user).then((res)=>{
                        this.toast.success("Utente aggiunto");
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
        },
        
        
        
        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
