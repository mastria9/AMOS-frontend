<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


            <div class="content__header content__boxed overlapping">
                <div class="content__wrap">

                        <!-- Page title and information -->
                        <h1 class="page-title mb-2">Logistica</h1>
                        <p><br/></p>
                        <p></p>
                        <!-- END : Page title and information -->
                </div>
            </div>
            <div class="content__boxed">
                <div class="content__wrap">
                    <div class="row bg-light p-2">
                        <div class="col-12 d-md-flex justify-content-md-end m-auto">
                            <a :href="'/couriers/?company='+this.company.id" class="btn btn-primary">Tutti i Corrieri</a>
                        </div>
                    </div>
                    <div class="row bg-light p-2">
                        <div class="col-md-6 m-auto">
                            <div class="card p-2">
                                <div class="card-header">
                                    <h4 class="card-title">Aggiungi un nuovo Corriere</h4>
                                </div>
                                <div class="card-body row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table table-borderless">
                                                    <tbody>
                                                        <tr>
                                                            <th>Magazzino</th>
                                                            <td>
                                                                <select class="form-select" v-model="this.courier.warehouse">
                                                                    <option v-for="(warehouse,key) in this.warehouses" :key="key" :value="warehouse.id">{{ warehouse.code }} - {{ warehouse.name }}</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Corriere</th>
                                                            <td>
                                                                <select class="form-select" v-model="this.courier.name">
                                                                    <option selected value="GLS">GLS</option>
                                                                    <!-- <option value="BRT">BRT</option>
                                                                    <option value="CRONO">Crono Poste</option>
                                                                    <option value="DHL">DHL</option>
                                                                    <option value="SDA">SDA</option>
                                                                    <option value="UPS">UPS</option>
                                                                    <option value="TNT">TNT</option> -->
                                                                </select>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Sede</th>
                                                            <td>
                                                                <input class="form-control" v-model="this.courier.location"/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Codice Cliente</th>
                                                            <td>
                                                                <input class="form-control" type="text" v-model="this.courier.client"/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Password</th>
                                                            <td>
                                                                <input class="form-control" type="text" v-model="this.courier.password"/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Codice Contratto</th>
                                                            <td>
                                                                <input class="form-control" type="text" v-model="this.courier.contract"/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Attiva</th>
                                                            <td>
                                                                <input class="form-checkbox" type="checkbox" v-model="this.courier.active"/>
                                                            </td>
                                                        </tr>
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        
                                </div>
                                <div class="card-footer">
                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-info" v-on:click="this.$router.go(-1)">Annulla</button>
                                        </div>
                                        <div class="col-6 d-flex justify-content-md-end">
                                            <button class="btn btn-danger" v-on:click="this.addCourier()">Aggiungi</button>
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
            courier:{
                company:null,
                warehouse:null,
                name:null,
                location:null,
                client:null,
                password:null,
                contract:null,
                active:false,
                
            },
            me:null,
            warehouses:[],
            
            
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
            this.getCompanies().then(this.getMe).then(this.getWarehouses)
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
        addCourier(){
            this.axios.post("/api/couriers/?company="+this.company.id,this.courier).then((res)=>{
                        this.toast.success("Corriere aggiunto");
                        this.$router.push("/couriers/?company="+this.company.id);
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText));
                            
                        }
                    })
        },
        async getWarehouses(){
            try{
                    const res = await this.axios.get("/api/warehouses/?company="+this.company.id).then((res)=>{
                        
                        if(res.data.results.length==0){
                            this.toast.warning("Nessun Magazzino registrato");
                        }
                        else{
                            this.warehouses=res.data.results;
                        }
                            

                        
                    }).catch((error)=>{
                        if(error.response!=null){
                        this.toast.error(error.response.data.detail);
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Magazzini)");
                };

        },
        
        changeCompany(key){
            
            window.location.href='/couriers/new?company='+this.companies[key].id;
            
        }
        
        
        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}

    

}
</script>