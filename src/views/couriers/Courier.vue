<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
         <section  class="content" id="content">
 
 
             <div class="content__header content__boxed overlapping">
                 <div class="content__wrap">
 
                         <!-- Page title and information -->
                         <h1 class="page-title mb-2">Corriere</h1>
                         <h2 class="h5">Stato del tuo corriere</h2>
                         <p></p>
                         <!-- END : Page title and information -->
                 </div>
             </div>
         <div class="content__boxed">
             <div class="content__wrap">
                 <div class="row bg-light p-2">
                     <div class="col-12 d-md-flex justify-content-md-end">
                         <a class="btn btn-warning" @click="this.$router.push('/couriers?company='+this.company.id)">Tutti i Corrieri</a>
                     </div>
                 </div>
             
                 <div class="row bg-light mt-2" v-if="this.courier">
                     <div class="col-md-6 m-auto">
                         <div class="card ">
                             <div class="card-header">
                                 <div class="row">
                                     <div class="col-7">
                                         <h4 class="card-title">{{this.courier.name}}</h4>
                                         <p class="card-category"><b>{{this.courier.warehouse.code}} {{this.courier.warehouse.name}}</b></p>
                                     </div>
                                     
                                 </div>
                             </div>
                             
                             <div class="card-body">
                                 <div class="row">
                                     <div class="col-md-12">
                                         <div class="table-responsive">
                                             <table class="table">
                                                 <tbody>
                                                     <tr><th>Magazzino</th><th>{{this.courier.warehouse.code}} {{this.courier.warehouse.name}}</th></tr>
                                                     <tr><th>Servizio</th><td>{{this.courier.name}}</td></tr>
                                                     <tr><th>Sede</th><td>{{this.courier.location}}</td></tr>
                                                     <tr><th>Codice Contratto</th><td>{{this.courier.contract}}</td></tr>
                                                    <tr><th>Codice Cliente</th><td><input class="form-control" type="text" v-model="this.courier.client"/></td></tr>
                                                    <tr><th>Password</th><td><input class="form-control" type="text" v-model="this.courier.password"/></td></tr>
                                                     <tr><th>Stato</th><td><input type="checkbox" v-model="this.courier.active"></td></tr>
                                                     
                                                 </tbody>
                                             </table>
                                         </div>
                                     </div>
                                 </div>
                                 <div class="row">
                                     <div class="col-6 text-left">
                                     </div>
                                     <div class="col-6 text-right">
                                         <button class="btn btn-success" v-on:click="this.saveCourier()">Invia modifiche</button>
                                     </div>
                                 </div>
                                 
                             </div>
                             <div class="card-footer d-md-flex justify-content-md-center m-auto">
                                 <button v-if="user.is_superuser" class="btn btn-danger" v-on:click="this.deleteCourier()"> !!! Elimina definitivamente !!! </button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
         
         <Footer/>
     </section>
             
 
         <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
         <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="courier" @update:collapse="(collapse=false)"/>
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
             
             courier:null,
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
                 this.getMe().then(this.getCompanies).then(this.getCourier)
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
         
         
         saveCourier(){
             this.axios.put("/api/couriers/"+this.courier.id+"/?company="+this.company.id,this.courier).then((res)=>{
                         this.toast.success("Modifiche salvate");
                         
                     }).catch((error)=>{
                         if(error.response!=null){
                             this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                         }
                     })
         },
         
         async getCourier(){
            try{
                    const res = await this.axios.get("/api/couriers/"+this.$route.query.id+"/?company="+this.company.id).then((res)=>{
                        this.courier=res.data;

                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Corriere)");
                };

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
         
         
         
         
         deleteCourier(){
             this.axios.delete("/api/couriers/"+this.courier.id+"/?company="+this.company.id).then((res)=>{
                         this.toast.success("Corriere eliminato definitivamente");
                         this.$router.push("/couriers?company="+this.company.id);
                         
                     }).catch((error)=>{
                         if(error.response!=null){
                             this.toast.error(String(error.response.status)+" "+String(error.response.statusText));
                         }
                     })
         },
         
         changeCompany(key){
             
             window.location.href='/couriers/?company='+this.companies[key].id;
             
         }
         
 
 
 
     },
     components:{Sidebar,HeaderNav,Footer}
 
 
     
 
 }
 </script>
 