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
            <div class="top col-12"><div class="col-12"><a class="btn btn-warning" :href="'/imports?company='+this.company.id">Tutti gli import</a></div></div>
            <div class="center"> 
                
                <div class="container-fluid">
                <template v-if="this.marketplaces.length>0">
                
                    <div class="col-12 text-left m-4"><h3>Importa</h3></div>
                    
                                                
                        
                    <Transition name="slide-fade">
                        <div class="row" v-if="firstRow">
                            <div class="col-3 pl-4">
                                <div class="card d-flex align-items-strech p-4">
                                
                                    <h5>Cosa vuoi importare?</h5>
                                    <select class=" custom-select" id="selectImport" v-model="ftype" >
                                        <option v-for="(value,key) in ftypes" :key="key" :value="key">{{value}}</option>
                                    </select>
                                    </div>
                            </div>
                            <!-- <div class="col-3 pl-4" v-if="ftype=='products'">
                                <div class="card d-flex align-items-strech p-4">
                                    <h5>Seleziona i Marketplace</h5>
                                    <select class=" custom-select" id="selectMarketplace" v-model="marketplace" multiple>
                                        <option v-for="(value,key) in marketplaces" :key="key" :value="value.id">{{value._code}} - {{value._country}}</option>
                                    </select>
                                    </div>
                            </div> -->
                            <div class="col-3 pl-4" v-if="ftype=='orders'">
                                <div class="card d-flex align-items-strech p-4">
                                    <h5>Template</h5>
                                    <select class="custom-select" v-model="importTemplateType">
                                        <option value="AMZ">Report Ordini Amazon (TXT)</option>
                                    </select>
                                    </div>
                            </div>
                            <div class="col-3 pl-4" v-if="(ftype=='products' && marketplaces.length>0)">
                                <div class="card d-flex align-items-strech p-4">
                                    <h5>Template</h5>
                                    <select class="custom-select" v-model="importTemplateType">
                                        <option value="AMZ">Report Inventario Amazon (TXT)</option>
                                    </select>
                                    </div>
                            </div>
                            <div class="col-3 pl-4" v-if="(ftype=='products' && marketplaces.length>0 && this.importTemplateType) || (ftype=='orders' && importTemplateType)">
                                <div class="card d-flex align-items-strech p-4">
                                
                                    <h5>Scegli il file</h5>
                                    <div class="custom-file">
                                        <label class="custom-file-label" style="height:38px" for="customFile" aria-describedby="customFile"  data-browse="Import File" aria-label="customFile">{{file.name}}</label>
                                        <input name="file" type="file" accept=".txt" id="customFile" v-on:change="file=$event.target.files[0]">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-3 pl-4" v-if="(ftype=='products' && marketplaces.length>0 && this.importTemplateType && file.name!=null) || (ftype=='orders' && importTemplateType && file.name!=null)">
                                <div class="card d-flex align-items-strech p-4">
                                    <h5>Importa</h5>
                                        <button type="button" class="btn btn-warning" :disabled="(ftype == null) || (file.name == null)" v-on:click="upload();">Importa</button>
                                </div>
                            </div>
                        </div>
                    </Transition>
                        
                        
                </template>
                <template v-else>
                    <div class="row col-12">
                        <div class="col-12">
                            <h5>L'azienda non ha nessun Marketplace attivo</h5>
                        </div>
                        <div class="col-12">
                            <button v-on:click="this.$router.push('/marketplaces?company='+this.company.id)" class="btn btn-success">Vai ai Marketplace</button>
                        </div>
                    </div>
                </template>
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
import HeaderNav from "../../components/HeaderNav.vue";
import Footer from "../../components/Footer.vue";
import { useToast } from "vue-toastification";
import ImportsVue from './Imports.vue';
function initialState (){
  return {

            checking:false,
            firstRow:true,
            secondRow:false,
            thirdRow:false,
            
            notAvailableYet:{},
            importobj:null,
            file:{
                name:null
            },
            fields: {
                id: { name :"ID",show:false },
                _create:{name :"Data",show:true },
                _ftype:{ name :"Tipo",show:true },
                _marketplace:{ name :"Marketplace",show:true },
                _status:{ name :"Stato",show:true },
                
                
            },
            importTemplateType:null,
            marketplaces:[],
            marketplace:[],
            collapse:false,
            company:{},
            companies:[],
            ftype:null,
            ftypes:{
                "products":"Prodotti",
                "orders":"Ordini",
                "prices":"Prezzi",
                "qty":"Quantità",
            },
            row:[],
            datasheet:{sheetnames:[],datasheet:[]},
            sheetindex:null,
            sheetindexSelect:false,
            jump:0,
            selectedFields:null,
            updateType:0,
            fieldsErrorMessage:null,
            
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
        isAllOk(){
            
            if(this.selectedFields){
                var allNull=true;
                for(const keyD in this.selectedFields){
                    if(this.selectedFields[keyD]!=null && this.selectedFields[keyD]!=""){
                        allNull=false;
                        break;
                    }
                }
                if(allNull) return false;

                var allColNull=true;
                
                for(const keyC in this.row){
                    if(this.row[keyC]!=null && this.row[keyC]!=""){
                        allColNull=false;
                    }
                }
                if(allColNull) return false;

                
                

                for(const keyA in this.selectedFields){
                    if(this.selectedFields[keyA]!==null && this.selectedFields[keyA]!==""){
                        for(const keyB in this.selectedFields){
                        if(this.selectedFields[keyB]!==null && this.selectedFields[keyB]!==""){
                            
                            if(keyB>keyA){
                                if(this.selectedFields[keyA]==this.selectedFields[keyB]){
                                    this.fieldsErrorMessage="Attenzione. Non puoi selezionare lo stesso valore per due righe diverse. Ricontrolla"
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            this.fieldsErrorMessage=null;
            return true;
            
            }
            return false;
        },
        
                    
        
    },
	methods:{
        // INIT
        async init(){
            this.getCompanies().then(this.getMarketplaces).then(this.getNewImport).then(this.getImport)
            
        },
        

        // GETTERS
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
        async getMarketplaces(){
            if(this.company!==null){
                try{
                    const res = await this.axios.get("/api/marketplaces/?company="+this.company.id)
                    this.marketplaces=res.data.results;
                    if(this.marketplaces.length==0){
                        this.toast.error("Nessun Marketplace attivo");
                    }
                    
                }  
                catch (error){
                    this.toast.error(error.response.data.detail);
                }  
            }
        },
        

        



        


        // VIEWS
        changeCompany(key){
            
            window.location.href='/imports/new?company='+this.companies[key].id;
            
        },

        


        
        // DATASHEET
        upload(){
            var data={}
            
            var formdata=new FormData()
            formdata.append("file",this.file)
            formdata.append("ftype",this.ftype)

            
            formdata.append("template",this.importTemplateType)
            // if(this.ftype=="products"){
            //     formdata.append("marketplace",this.marketplace)
            // }
                
                this.axios.post("/api/imports/?company="+this.company.id,formdata, {headers:{ 'X-CSRFToken':$cookies.get('csrftoken'), 'Content-Type': 'multipart/form-data','Content-Disposition':'attachment;filename='+this.file.name}}).then((res)=>{
                    if(res.status===201){
                        this.toast.success("Import Creato");
                        this.$router.push("/imports?company="+this.company.id);
                        
                    };

                }).catch((error)=>{
                    this.checking=false
                    this.toast.error(error.response.data.detail)
                });
            
        },
        

        

        
        
        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>