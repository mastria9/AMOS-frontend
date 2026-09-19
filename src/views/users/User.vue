<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">
            <div class="content__header content__boxed overlapping">
                <div class="content__wrap">
                    <!-- Page title and information -->
                    <h1 class="page-title mb-2" v-if="this.company">Utenti</h1>
                    <h2 class="h5">Modifica dati utente</h2>
                </div>

                <p></p>
                <!-- END : Page title and information -->
            </div>
            <div class="content__boxed">
                <div class="content__wrap">
                    <div class="row mt-2 mb-2 p-2 bg-light">
                        
                        <div class="col-12 d-md-flex justify-content-md-end">
                            <button class=" m-auto me-0 btn btn-primary" v-on:click="this.$router.go(-1)">Indietro</button>
                        </div>
                    </div>
                    <div class="row bg-light">
                        <div class="col-md-6">
                            <div class="card ">
                                <div class="card-header">
                                    <div class="row">
                                        <div class="col-md-6 text-left">
                                            <h4 class="card-title"><i class="text-info fa fa-user"></i> {{this.user.username}}</h4>
                                            <p class="card-category"><b>{{this.user.first_name}} {{this.user.last_name}}</b></p>
                                        </div>
                                        <div class="col-md-6 d-md-flex justify-content-md-end m-auto mt-0">
                                            <template v-if="(this.me.is_staff && this.company.vendor!=this.user.id)" >
                                                <button class="btn btn-danger" v-on:click="this.setUserStatus()" v-if="this.user.is_active==true">Disattiva</button>
                                                <button class="btn btn-success" v-on:click="this.setUserStatus()" v-if="this.user.is_active==false">Attiva</button>
                                            </template>
                                        </div>

                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 card-category text-left">Iscritto dal {{this.user._date_joined}}</div>
                                        <div class="col-md-6 card-category text-right">Ultimo login {{this.user._last_login}}</div>
                                    </div>
                                </div>
                                <div class="card-body" >
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <tbody v-if="!this.modify.user">
                                                        <tr><th>Nome</th><td>{{this.user.first_name}}</td></tr>
                                                        <tr><th>Cognome</th><td>{{this.user.last_name}}</td></tr>
                                                        <tr><th>Email</th><td>{{this.user.email}}</td></tr>
                                                        <tr><th>Telefono</th><td>{{this.user.profile.phone}}</td></tr>
                                                    </tbody>
                                                    
                                                    <tbody v-else>
                                                        <tr><th>Nome</th><td><input type="text" v-model="this.user.first_name"/></td></tr>
                                                        <tr><th>Cognome</th><td><input type="text" v-model="this.user.last_name"/></td></tr>
                                                        <tr><th>Email</th><td>{{this.user.email}}</td></tr>
                                                        <tr><th>Telefono</th><td><input type="text" v-model="this.user.profile.phone"/></td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <button v-if="!modify.user" class="btn btn-primary" v-on:click="this.modify.user=!this.modify.user">Modifica</button>
                                            <button v-if="modify.user" class="btn btn-primary" v-on:click="this.modify.user=!this.modify.user" >Annulla</button>
                                        </div>
                                        <div class="col-6 d-md-flex justify-content-md-end">
                                            <button v-if="modify.user" class="btn btn-success" v-on:click="this.saveUser()">Invia modifiche</button>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card ">
                                <div class="card-header">
                                    <h4 class="card-title"><i class="text-info fa fa-tablet"></i> 2FA - Two Factor Authentication</h4>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <p><i class="text-success fa fa-circle"></i> L'autenticazione a due fattori è attiva</p>
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
import Footer from "../../components/Footer.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {
        collapse:false,
            user:{"profile":{}},
            modify:{
                user:false,
            },
            me:{},
            companies:[],
            company:{},
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
            if(this.$route.query.id!=null){
                this.getCompanies()
                this.getUser()
                this.getMe()
                
            }
            else{
                this.router.push("/dashboard");
            }
        },
        
        async getUser(){
                this.axios.get("/api/users/"+this.$route.query.id+"/?company="+this.$route.query.company).then((res)=>{
                        this.user=res.data;
                        if(this.user.profile==null){
                            this.user.profile={}
                        }
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    });
        },
        saveUser(){
            let user={}
            user["first_name"]=this.user.first_name
            user["last_name"]=this.user.last_name
            user["profile"]={}
            user["profile"]["phone"]=this.user.profile.phone
            this.axios.put("/api/users/"+this.user.id+"/",user).then((res)=>{
                        this.toast.success("Modifiche salvate");
                        this.$router.go("/users/");
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    });
        },
        setUserStatus(){
            var data={};
            data["is_active"]=!this.user.is_active;
            this.axios.put("/api/users/"+this.user.id+"/",data).then((res)=>{
                        if(res.data.is_active){
                            this.toast.success("Utente attivato");
                            this.init();
                        }
                        else{
                            this.toast.error("Utente disattivato");
                            this.init();
                        }
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
        },
        async getMe(){
            try{
                    const res = await this.axios.get("/api/me/").then((res)=>{
                        this.me=res.data.results[0];
                        
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
        changeCompany(index){
            window.location.href='/dashboard/?company='+this.companies[index].id;
        },
        
},
    components:{
        Sidebar,
        HeaderNav,Footer
        
    }


    

}
</script>