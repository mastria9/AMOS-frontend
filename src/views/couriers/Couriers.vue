<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
         <section  class="content" id="content">
 
 
         <div class="content__header content__boxed overlapping">
             <div class="content__wrap">
 
                     <!-- Page title and information -->
                     <h1 class="page-title mb-2">Logistica</h1>
                     <h2 class="h5">Servizi di Logistica e Corrieri</h2>
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
                                             <h4 class="card-title">Informazioni sui tuoi corrieri</h4>
                                             <p class="card-category">Stato dei tuoi corrieri</p>
                                         </div>
                                         <div class="col-6 d-md-flex justify-content-md-end m-auto">
                                             <a :href="'/couriers/new/?company='+this.company.id" v-if="this.user.is_staff" class="btn btn-primary">Aggiungi Corriere</a>
                                         </div>
                                     </div>
                                 </div>
                                 <div class="card-body ">
                                     <div class="row">
                                         <div class="col-md-12">
                                             <div class="table-responsive">
                                                 <table class="table">
                                                     <tbody>
                                                         <tr><th>Servizio</th><th>Sede</th><th>Contratto</th><th>Magazzino</th><th>Codice Cliente</th><th>Stato</th></tr>
                                                         <tr v-for="(courier,key) in this.couriers" :key="key">
                                                             <td><b>{{courier.name}}</b></td>
                                                             <td>{{ courier.location }}</td>
                                                             <td>{{ courier.contract }}</td>
                                                             <td>{{courier.warehouse.code}} - {{courier.warehouse.name}}</td>
                                                             <td>{{ courier.client }}</td>
                                                             <td><i class="bi bi-check" v-if="!courier.active"></i><i v-else class="text-danger bi bi-x-lg"></i></td>
                                                             <td><a class="btn btn-warning" title="Vedi" :href="'/courier?id='+courier.id+'&company='+this.company.id">Vedi</a></td>
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
 import { useToast } from "vue-toastification";
 function initialState (){
   return {
     collapse:false,
             company:{},
             companies:[],
             couriers:[],
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
             this.getCompanies().then(this.getCouriers).then(this.getMe())
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
         async getCouriers(){
             try{
                     const res = await this.axios.get("/api/couriers/?company="+this.company.id).then((res)=>{
                         
                         if(res.data.results.length==0){
                             this.toast.warning("Nessun corriere registrato");
                         }
                         else{
                             this.couriers=res.data.results;
                         }
                             
 
                         
                     }).catch((error)=>{
                         if(error.response!=null){
                         this.toast.error(error.response.data.detail);
                         }
                     })
                 }
                 catch(error) {
                     this.toast.error("Errore indefinito (Corrieri)");
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
             
             window.location.href='/couriers?company='+this.companies[key].id;
             
         }
 
         
         
         
         
         
         
         
 
 
 
     },
     components:{Sidebar,HeaderNav,Footer}
 
 
     
 
 }
 </script>