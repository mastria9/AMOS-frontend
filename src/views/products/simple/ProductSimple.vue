<template>
  <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                <h1 class="page-title mb-2">Prodotto semplice</h1>
                <h2 class="h5">Modifica il tuo prodotto</h2>
                <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed" v-if="this.ready">
            <div class="content__wrap">

                <div class="row p-2 bg-light">
                    <div class="col-3">
                        <h5>SKU PRODOTTO: {{this.product.sku}}</h5>
                    </div>
                    
                    <div class="col-1 mb-0 m-auto d-md-flex justify-content-md-end">
                        <a :href="'/products/simple/?company='+this.company.id+'&marketplace='+this.marketplace.id" class="btn btn-primary">Tutti i prodotti</a>
                    </div>
                </div>
                <div class="row p-2 bg-light">
                    <div class="col-3">
                        <b>Cambia Marketplace</b>
                        <select class="form-select ml-2" v-on:change="changeMarketplace($event)">
                            <option :selected="market.id==this.marketplace.id" v-for="(market,key) in this.marketplaces" :key="key" :value="market.id">{{market._code}} - {{market._country}} - {{market.account}}</option>
                        </select>
                    </div>
                    
                </div>
                <div class="p-2 row bg-light">
                    <div class="col-5">
                        <img class="me-2 " :src="marketplaceImg" width="30"/>
                        <b>Sei in {{marketplace._code}} {{marketplace._country}} - ({{marketplace.account}})</b>
                    </div>
                    <div class="col-2">
                        <div class="row">
                                <h5>Associato a:</h5>
                                <template v-if="this.product.item">
                                    <div>
                                        <a class="me-2" :href="'/item/?company='+this.company.id+'&id='+this.product.item.id"><b>{{this.product.item.item_code}}</b></a>{{this.product.item.name}}
                                    </div>
                                </template>
                                <template v-else>
                                    <b>Non associato a nessun articolo del magazzino</b>
                                </template>

                        </div>

                    </div>
                    <div class="col-3">
                        <div class="row">
                            <div class="col-1 p-2 d-md-flex justify-content-md-end"><i class="text-danger bi bi-link"></i></div>
                            <div class="col-11">
                                <select class="form-select" v-model="this.product.item">
                                    <option v-for="(item,key) in this.items" :key="key" :value="item">{{item.item_code}} | {{item.name}}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-2">
                        <button class="btn btn-outline" style="color:white; background:grey; float:right; border-color:white;" v-on:click="saveProduct()">Salva bozza</button>
                    </div>
                </div>
                <div class="row card mt-4 bg-light">
                    <div class="row col-12 mt-2 mb-2">
                        <div class="col-12 mt-1 content-full-width">
                            <ul role="tablist" class="nav nav-tabs nav-fill">
                                <li  class="nav-item">
                                    <a v-on:click="tab='general'" class="nav-link nav-link-info" :class="{ 'active' : tab=='general'}" id="general-tab" href="#" role="tab" ><b>Generale</b></a>
                                </li>
                                <li class="nav-item">
                                    <a v-on:click="tab='attribute'" class="nav-link nav-link-warning" :class="{ 'active' : tab=='attribute'}" id="attribute-tab" href="#" role="tab" ><b>Attributi</b></a>
                                </li>                                
                                <li class="nav-item">
                                    <a v-on:click="tab='fx'" class="nav-link nav-link-warning" :class="{ 'active' : tab=='fx'}" id="fx-tab" href="#" role="tab" ><b>Funzionalità</b></a>
                                </li>                                
                            </ul>
                        </div>
                    </div>
                    <hr/>
                        <div class="tab-content" id="tabContent">
                            <div class="tab-pane fade show" :class="{ 'active' : tab=='general'}" role="tabpanel" aria-labelledby="general-tab">
                                <div class="row">
                                    <div class="mt-0 ps-4 pe-4 col-5">
                                        <!-- Immagine principale -->
                                        <div class="p-3">
                                            <h6>Immagine principale</h6>
                                            <div class="p-5 bg-light mb-1 drop" :class="getClasses0" @dragover.prevent="dragOver(0)" @dragleave.prevent="dragLeave(0)" @drop.prevent="drop($event,0)" style="width:100%; height:400px;" :style="{ 'background-image': 'url(\'/src/assets/img/uploads/yellow.png\')' }">
                                                <img :src="this.product.marketplace[this.marketplace.id].image0" v-if="this.product.marketplace[this.marketplace.id].image0" style="width:95%; height:95%; overflow:hidden;"/>
                                                <h1 v-if="image0.wrongFile">File immagine sbagliato o corrotto</h1>
                                                <svg v-if="image0.wrongFile" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                                                </svg>
                                            </div>
                                            <div class="row">
                                                <div class="col-6">
                                                    <button class="btn btn-outline-secondary ps-2 pe-2 pt-0 pb-0 " v-on:click="moveImage(0,'right')"><i class="bi bi-arrow-down">Sposta</i></button>
                                                </div>
                                                <div class="col-6 d-md-flex justify-content-md-end">
                                                    <button v-on:click="delImages(0)" class="btn btn-outline-danger ps-2 pe-2 pt-0 pb-0" ><i class="bi bi-trash"></i>Cancella</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="p-0 m-0 row">
                                            
                                            <div v-for="i in (1,7)" :key="i" class="m-1" style="width:200px; display:inline-block; text-align:center;">
                                                <h6>Immagine secondaria {{i}}</h6>
                                                <div class="drop" :class="this['getClasses'+i]" @dragover.prevent="dragOver(i)" @dragleave.prevent="dragLeave(i)" @drop.prevent="drop($event,i)" style="width:100%;height:100px; background-image:url('/src/assets/img/uploads/blue.png'); margin:auto;">
                                                    <img :src="this.product.marketplace[this.marketplace.id]['image'+i]" v-if="this.product.marketplace[this.marketplace.id]['image'+i]"/>
                                                    <h1 v-if="this['image'+i].wrongFile">File immagine sbagliato o corrotto</h1>
                                                    <svg v-if="this['image'+i].wrongFile" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                                                    </svg>
                                                    
                                                </div>
                                                <div class="row pt-1">
                                                    <div class="col-6">
                                                        <button class="btn btn-outline-secondary  ps-2 pe-2 pt-0 pb-0 m-1"  v-on:click="moveImage(i,'left')"><i v-if="i==1" class="bi bi-arrow-up" ></i><i v-else class="bi bi-arrow-left"></i></button>
                                                        <button class="btn btn-outline-secondary  ps-2 pe-2 pt-0 pb-0 m-1"  v-on:click="moveImage(i,'right')" ><i class="bi bi-arrow-right"></i></button>
                                                        </div>
                                                        <div class="col-6 d-md-flex justify-content-md-end">
                                                            <button class="btn btn-outline-danger ps-2 pe-2 pt-0 pb-0 m-1" v-on:click="delImages(i)"><i class="bi bi-trash"></i></button>

                                                        </div>
                                                </div>
                                                
                                            </div>
                                            <div class="m-1" style="width:200px; display:inline-block;">
                                                
                                                <h6>Miniatura</h6>
                                                <div class="drop" :class="this['getClasses8']" @dragover.prevent="dragOver(8)" @dragleave.prevent="dragLeave(8)" @drop.prevent="drop($event,8)" style="width:100%;height:100px; background-image:url('/src/assets/img/uploads/violet.png'); margin:auto;">
                                                    <img :src="this.product.marketplace[this.marketplace.id]['image8']" v-if="this.product.marketplace[this.marketplace.id]['image8']"/>
                                                    <h1 v-if="this['image8'].wrongFile">File immagine sbagliato o corrotto</h1>
                                                    <svg v-if="this['image8'].wrongFile" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                                                    </svg>
                                                    
                                                </div>
                                                <div class="row pt-1">
                                                    <div class="col-6 d-md-flex justify-content-md-start">
                                                        <button class="btn btn-outline-secondary  ps-2 pe-2 pt-0 pb-0 m-1"  v-on:click="moveImage(8,'left')"><i class="bi bi-arrow-left"></i></button>
                                                    </div>
                                                    <div class="col-6 d-md-flex justify-content-md-end">
                                                        <button class="btn btn-outline-danger ps-2 pe-2 pt-0 pb-0 m-1" v-on:click="delImages(8)"><i class="bi bi-trash"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                       
                                       
                                    </div>
                                        
                                </div>
                                    
                                  
                                    <div class="row col-7  m-auto ">
                                        <div class="col-12 pb-0 p-2 card">
                                            <div class="card-header">
                                                <h6 class="card-title">Obbligatori</h6>
                                            </div>
                                            <div class="card-body">
                                            <table class="table table-sm table-responsive table-general">
                                                <tr><th>SKU</th><td>
                                                    <template v-if="this.product.id">
                                                        <b>{{product.sku}}</b>
                                                    </template>
                                                    <template v-else>
                                                        <input class="form-control" :disabled="product.id" type="text" v-model="product.sku">
                                                    </template>
                                                </td></tr>
                                                <tr><th>Marca</th><td>
                                                    <input class="form-control" type="text" v-model="product.brand">
                                                </td></tr>
                                                <tr><th>GTIN</th><td><div class="input-group"><div class="input-group-prepend">
                                                                                                    <select class="form-select mr-2" v-model="product.gtin_type">
                                                                                                        <option value="NOGTIN">ESENTE</option>
                                                                                                        <option value="EAN">EAN</option>
                                                                                                        <option value="ISBN">ISBN</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                                <input class="form-control mr-2" type="text" v-model="product.gtin" :disabled="this.product.gtin_type=='NOGTIN'">
                                                        </div>
                                                    </td>
                                                </tr>
                                                
                                                <tr><th>Titolo</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].title"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Titolo (calcolato)<i class="bi bi-question" style="font-size:1.3rem;"></i></th><td class="pt-0 pb-0">{{this.calculated_title}}</td></tr>
                                            </table>
                                            </div></div>
                                                <div class="col-12 pb-0 mt-3 mb-0 p-2 card">
                                            <div class="card-header">
                                                <h6 class="card-title">Necessari</h6>
                                            </div>
                                            <div class="card-body">
                                            <table class="table table-sm table-responsive table-general">
                                                <tr><th>Descrizione breve</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].short_description"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Descrizione breve (calcolata)</th><td class="pt-0 pb-0">{{this.calculated_short_description}}</td></tr>
                                                <tr><th>Parole chiave</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].keywords"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Parole chiave (calcolate)</th><td class="pt-0 pb-0">{{this.calculated_keywords}}</td></tr>
                                            </table>
                                        </div>
                                        </div>

                                            <div class="col-12 pb-0 mt-3 mb-0 p-2 card">
                                            <div class="card-header">
                                                <h6 class="card-title">Facoltativi</h6>
                                            </div>
                                            <div class="card-body">
                                            <table class="table table-sm table-responsive table-general">
                                                <tr><th>Bullet point 1</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point1"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 1 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point1}}</td></tr>
                                                <tr><th>Bullet point 2</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point2"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 2 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point2}}</td></tr>
                                                <tr><th>Bullet point 3</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point3"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 3 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point3}}</td></tr>
                                                <tr><th>Bullet point 4</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point4"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 4 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point4}}</td></tr>
                                                <tr><th>Bullet point 5</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point5"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 5 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point5}}</td></tr>
                                                <tr><th>Bullet point 6</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point6"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 6 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point6}}</td></tr>
                                                <tr><th>Bullet point 7</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point7"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 7 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point7}}</td></tr>
                                                <tr><th>Bullet point 8</th><td><input class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].bullet_point8"></td></tr>
                                                <tr class="small text-danger"><th class="pt-0 pb-0" title="Usa le variabili della sezione Attributi">Bullet Point 8 (calcolato)</th><td class="pt-0 pb-0">{{this.calculated_bullet_point8}}</td></tr>
                                            </table>
                                        </div>
                                        </div>
                                       
                                        
                                        
                                        
                                    </div>
                                </div>
                                <div class="row col-12 pr-5 pl-5">
                                    <div class="col-12 p-3" >
                                        <h6 title="Usa le variabili della sezione Attributi">Descrizione HTML</h6>
                                        <code>
                                            <textarea class="form-control" type="text" v-model="product.marketplace[this.marketplace.id].description" style="min-height:200px"></textarea>
                                        </code>
                                        <hr/>
                                    </div>
                                    <div class="m-auto col-12">
                                        <h6 class="text-danger">Vista descrizione</h6>
                                        <div style="background:white;" class="p-4" v-html="this.calculated_description"></div>
                                        
                                    </div>
                                </div>
                                    
                                
                            
                        </div>
                        
                        <div class="tab-pane fade show" :class="{ 'active' : tab=='attribute'}"  role="tabpanel" aria-labelledby="attribute-tab">
                                <template v-if="this.category">
                                <div class="card-header mb-4">
                                    <div class="card-title">{{this.category.title}}<a class="float-right btn btn-warning" :href="'/category/?company='+this.company.id+'&marketplace='+this.marketplace.id+'&id='+this.category.id">Vai alla categoria</a></div>
                                    <div class="card-category"><template v-if="this.category.parent">{{this.category.parent.title}}</template></div>
                                </div>
                                <div class="card-body">
                                    <table class="table table-sm">
                                        <thead><tr><th>Codice</th><th>Attributo</th><th>Valore</th><th></th></tr></thead>
                                        <tbody>
                                            <template v-for="attribute,key in this.category.attributes" :key="key">
                                                <tr>
                                                    <td>{{attribute.name}}<template v-if="attribute.type=='DECIMAL'"><span class="ml-3 small">({{attribute.name}}_unit)</span></template></td>
                                                    <td>{{attribute.description}}</td>
                                                    <template v-if="attribute.type=='INT'">
                                                        <td><input class="form-control" v-model="this.product.marketplace[this.marketplace.id][attribute.name]" type="text" v-on:keyup="this.product.marketplace[this.marketplace.id][attribute.name] = this.product.marketplace[this.marketplace.id][attribute.name].replace(/[^0-9]/g, ''); this.product.marketplace[this.marketplace.id][attribute.name] = this.product.marketplace[this.marketplace.id][attribute.name].replace(/(\..*)\./g, '$1');"></td>
                                                        <td>(Solo numeri interi)</td>
                                                    </template>
                                                    <template v-if="attribute.type=='DECIMAL' && this.product.marketplace[this.marketplace.id][attribute.name]">
                                                        <td>
                                                            <div class="input-group">
                                                                <div class="input-group-prepend">
                                                                    <select class="form-select mr-2" v-model="this.product.marketplace[this.marketplace.id][attribute.name]['unit']">
                                                                        <option value="mm">mm</option>
                                                                        <option value="cm">cm</option>
                                                                        <option value="m">m</option>
                                                                        <option value="L">L</option>
                                                                        <option value="cL">cL</option>
                                                                        <option value="mL">mL</option>
                                                                        <option value="g">g</option>
                                                                        <option value="Kg">Kg</option>
                                                                    </select>
                                                                </div>
                                                                <input class="form-control" v-model="this.product.marketplace[this.marketplace.id][attribute.name]['value']" type="text"  v-on:keyup="this.product.marketplace[this.marketplace.id][attribute.name]['value'] = this.product.marketplace[this.marketplace.id][attribute.name]['value'].replace(/[^0-9.]/g, ''); this.product.marketplace[this.marketplace.id][attribute.name]['value'] = this.product.marketplace[this.marketplace.id][attribute.name]['value'].replace(/(\..*)\./g,'$1');">
                                                            </div>
                                                        </td>
                                                        <td></td>
                                                    </template>
                                                    <template v-if="attribute.type=='CHAR'">
                                                        <td><input class="form-control" v-model="this.product.marketplace[this.marketplace.id][attribute.name]" oninput="this.value=this.value.toLowerCase();" type="text" ></td>
                                                        <td></td>
                                                    </template>
                                                    <template v-if="attribute.type=='BOOLEAN'">
                                                        <td><input class="form-control" v-model="this.product.marketplace[this.marketplace.id][attribute.name]" type="checkbox"></td>
                                                        <td></td>
                                                    </template>
                                                    <template v-if="attribute.type=='TEXT'">
                                                        <td><input class="form-control" v-model="this.product.marketplace[this.marketplace.id][attribute.name]" type="text"></td>
                                                        <td></td>
                                                    </template>
                                                    <template v-if="attribute.type=='URL'">
                                                        <td><input class="form-control" v-model="this.product.marketplace[this.marketplace.id][attribute.name]" type="url"></td>
                                                        <td></td>
                                                    </template>

                                                    
                                                </tr>


                                                

                                                
                                                

                                            </template>
                                        </tbody>
                                        
                                        
                                    </table>
                                </div>
                            </template>
                            <template v-else>
                                <div class="row mt-4">
                                    <div class="col-12 m-4">
                                        <h6 style="display: inline;">Il prodotto in questo marketplace non ha ancora una categoria</h6><a :href="('/categories?company='+this.company.id+'&marketplace='+this.marketplace.id)" class="btn btn-primary ms-3">Vai alle categorie</a>
                                    </div>
                                </div>
                            </template>
                        </div>
                        
                        
                        <div class="tab-pane fade show" :class="{ 'active' : tab=='fx'}"  role="tabpanel" aria-labelledby="fx-tab">
                            <div class="card">
                                <div class="card-header mb-4">
                                    <h6>Copia su altri prodotti</h6>
                                </div>
                                <div class="card-body">
                                    <div class="col-12 row">
                                        <div class="col-10 row">
                                            <div class="col-5">
                                                <ul>
                                                    <li><input type="checkbox" v-model="copyTo['title']">Titolo</li>
                                                    <li><input type="checkbox" v-model="copyTo['description']">Descrizione</li>
                                                    <li><input type="checkbox" v-model="copyTo['short_description']">Descrizione breve</li>
                                                    <li><input type="checkbox" v-model="copyTo['bullet_point']">Bullet Point</li>
                                                    <li><input type="checkbox" v-model="copyTo['keywords']">Parole chiave</li>
                                                    <li><input type="checkbox" v-model="copyTo['brand']">Marca</li>
                                                    <li><input type="checkbox" v-model="copyTo['images']">Immagini</li>
                                                </ul>                                        
                                            </div>
                                            <div class="col-7">
                                                Scegli il Marketplace di destinazione
                                                <select class="form-select" v-model="this.marketTo" v-on:change="this.getAbstractProductsTo()">
                                                    <option v-for="market,key in this.marketplaces" :value="market.id" :key="key">{{market._code}} {{market._country}} ({{market.account}})</option>
                                                </select>
                                            </div>
                                            <div class="col-12 mt-5">
                                                <h6>Scegli i Prodotti sui quali vuoi copiare</h6>
                                            </div>
                                            <div class="col-3 mt-4">
                                                <b>Semplici</b>
                                                <select class="form-select mt-2" multiple style="width:100%;height:150px;" v-model="this.productsTo.simple">
                                                    <template v-for="product,key in this.abstractProductsTo.simple" :key="key">
                                                        <option v-if="product.id!=this.product.id" :value="product.id" >{{product.sku}}</option>
                                                    </template>
                                                </select>
                                            </div>
                                            <div class="col-3 mt-4">
                                                <b>Configurabili</b>
                                                <select class="form-select mt-2" multiple style="width:100%;height:150px;" v-model="this.productsTo.configurable">
                                                    <option v-for="product,key in this.abstractProductsTo.configurable" :value="product.id" :key="key">{{product.sku}}</option>
                                                </select>
                                            </div>
                                            <div class="col-3 mt-4">
                                                <b>Multipli</b>
                                                <select class="form-select mt-2" multiple style="width:100%;height:150px;" v-model="this.productsTo.multiple">
                                                    <option v-for="product,key in this.abstractProductsTo.multiple" :value="product.id" :key="key">{{product.sku}}</option>
                                                </select>
                                            </div>
                                            <div class="col-3 mt-4">
                                                <b>Composti</b>
                                                <select class="form-select mt-2" multiple style="width:100%;height:150px;" v-model="this.productsTo.bulk">
                                                    <option v-for="product,key in this.abstractProductsTo.bulk" :value="product.id" :key="key">{{product.sku}}</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="col-2 m-auto text-center">
                                            <input class="mr-2" type="checkbox" v-model="this.overwriteTo">Copia anche se nullo<br/><br/>
                                            <button class="btn btn-danger" v-on:click="this.copyToProducts()">Copia</button>

                                        </div>
                                    </div>
                                        
                                        
                                    
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header mb-4">
                                    <h6>Copia da un altro prodotto</h6>
                                </div>
                                <div class="card-body">
                                    <div class="col-12 row">
                                        <div class="col-2"><b>Cosa vuoi copiare?</b>
                                            <ul class="mt-2">
                                                <li><input type="checkbox" v-model="copyFrom['title']">Titolo</li>
                                                <li><input type="checkbox" v-model="copyFrom['description']">Descrizione</li>
                                                <li><input type="checkbox" v-model="copyFrom['short_description']">Descrizione breve</li>
                                                <li><input type="checkbox" v-model="copyFrom['bullet_point']">Bullet Point</li>
                                                <li><input type="checkbox" v-model="copyFrom['keywords']">Parole chiave</li>
                                                <li><input type="checkbox" v-model="copyFrom['brand']">Marca</li>
                                                <li><input type="checkbox" v-model="copyFrom['images']">Immagini</li>
                                            </ul>                                        
                                        </div>
                                        <div class="col-3">
                                            <b>Scegli il Marketplace dal quale vuoi copiare</b>
                                            
                                            <select class="form-select mt-2" style="width:100%;" v-model="this.marketFrom" v-on:change="this.getAbstractProductsFrom">
                                                <option v-for="market,key in this.marketplaces" :value="market.id" :key="key">{{market._code}} {{market._country}} ({{market.account}})</option>
                                            </select>
                                        </div>
                                        <div class="col-3">
                                            <b>Scegli il Prodotto dal quale vuoi copiare</b>
                                            <table>
                                                <tr>
                                                    <th>Semplici</th>
                                                    <td>
                                                        <select class="form-select mt-2" style="width:100%;" v-model="this.productFrom.simple" v-on:change="this.resetOtherProductFrom('simple')">
                                                            <option v-for="product,key in this.abstractProductsFrom.simple" :key="key" :value="product.id">{{product.sku}}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Configurabili</th>
                                                    <td>
                                                        <select class="form-select mt-2" style="width:100%;" v-model="this.productFrom.configurable" v-on:change="this.resetOtherProductFrom('configurable')">
                                                            <option v-for="product,key in this.abstractProductsFrom.configurable" :key="key" :value="product.id">{{product.sku}}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Multipli</th>
                                                    <td>
                                                        <select class="form-select mt-2" style="width:100%;" v-model="this.productFrom.multiple" v-on:change="this.resetOtherProductFrom('multiple')">
                                                            <option v-for="product,key in this.abstractProductsFrom.multiple" :key="key" :value="product.id">{{product.sku}}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Composti</th>
                                                    <td>
                                                        <select class="form-select mt-2" style="width:100%;" v-model="this.productFrom.bulk" v-on:change="this.resetOtherProductFrom('bulk')">
                                                            <option v-for="product,key in this.abstractProductsFrom.bulk" :key="key" :value="product.id">{{product.sku}}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="col-4 m-auto text-center">
                                            <input class="mr-2" type="checkbox" v-model="this.overwriteFrom">Sovrascrivi anche se nullo<br/><br/>
                                            <button class="btn btn-danger" v-on:click="this.copyFromProduct()">Copia</button>
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
const AUTH_TOKEN = "51fb50cfbedaf479a0080615e77cc82392628a21";
import Sidebar from "../../../components/Sidebar.vue";
import HeaderNav from "../../../components/HeaderNav.vue";
import Footer from "../../../components/Footer.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {  
            prev:null,
            next:null,
            tab:'general',
            categories:[],
            ready:false,
            
            marketplaces:[],
            marketplaceKey:"",
            marketplace:null,
            marketplaceImg:"",
            category:null,
            collapse:false,
            company:{},
            companies:[],
            items:[],
            product:{},
            abstractProductsFrom:{
                "simple":{},
                "configurable":{},
                "multiple":{},
                "bulk":{}
            },
            abstractProductsTo:{
                "simple":{},
                "configurable":{},
                "multiple":{},
                "bulk":{}
            },
            copyFrom:{
                "title":false,
                "images":false,
                "description":false,
                "short_description":false,
                "bullet_point":false,
                "keywords":false,
                "brand":false,
            },
            copyTo:{
                "title":false,
                "images":false,
                "description":false,
                "short_description":false,
                "bullet_point":false,
                "keywords":false,
                "brand":false,
            },
            marketTo:{},
            productsTo:{
                "simple":{},
                "configurable":{},
                "multiple":{},
                "bulk":{},
            },
            marketFrom:null,
            productFrom:{
                "simple":null,
                "configurable":null,
                "multiple":null,
                "bulk":null,
            },
            overwriteFrom:false,
            overwriteTo:false,
            
            
            gtinIsOn:false,
            
            image0:{
                isDragging:false,
                wrongFile:false,
            },
            image1:{
                isDragging:false,
                wrongFile:false,
            },
            image2:{
                isDragging:false,
                wrongFile:false,
            },
            image3:{
                isDragging:false,
                wrongFile:false,
            },
            image4:{
                isDragging:false,
                wrongFile:false,
            },
            image5:{
                isDragging:false,
                wrongFile:false,
            },
            image6:{
                isDragging:false,
                wrongFile:false,
            },
            image7:{
                isDragging:false,
                wrongFile:false,
            },
            image8:{
                isDragging:false,
                wrongFile:false,
            },
            image9:{
                isDragging:false,
                wrongFile:false,
            },
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
        //immagini
        getClasses0(){
            return { isDragging : this.image0.isDragging }
        },
        getClasses1(){
            return { isDragging : this.image1.isDragging }
        },
        getClasses2(){
            return { isDragging : this.image2.isDragging }
        },
        getClasses3(){
            return { isDragging : this.image3.isDragging }
        },
        getClasses4(){
            return { isDragging : this.image4.isDragging }
        },
        getClasses5(){
            return { isDragging : this.image5.isDragging }
        },
        getClasses6(){
            return { isDragging : this.image6.isDragging }
        },
        getClasses7(){
            return { isDragging : this.image7.isDragging }
        },
        getClasses8(){
            return { isDragging : this.image8.isDragging }
        },
        getClasses9(){
            return { isDragging : this.image9.isDragging }
        },
        //valori calcolati
        calculated_title(){
            if("title" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["title"];
                return this.calculate(text)
            }
        },
        calculated_short_description(){
            if("short_description" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["short_description"];
                return this.calculate(text)
            }
        },
        calculated_keywords(){
            if("keywords" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["keywords"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point1(){
            if("bullet_point1" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point1"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point2(){
            if("bullet_point2" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point2"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point3(){
            if("bullet_point3" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point3"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point4(){
            if("bullet_point4" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point4"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point5(){
            if("bullet_point5" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point5"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point6(){
            if("bullet_point6" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point6"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point7(){
            if("bullet_point7" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point7"];
                return this.calculate(text)
            }
        },
        calculated_bullet_point8(){
            if("bullet_point8" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["bullet_point8"];
                return this.calculate(text)
            }
        },
        calculated_description(){
            if("description" in this.product.marketplace[this.marketplace.id]){
                let text =this.product.marketplace[this.marketplace.id]["description"];
                return this.calculate(text)
            }
        },
    },
	methods:{
        calculate(text){
            if(this.category!=null){
                if("attributes" in this.category){
                    for(var i=0;i<this.category.attributes.length;i++){
                        let search=this.category.attributes[i].name
                        let type=this.category.attributes[i].type
                        let value=""
                        let unit=""
                        if(type=="DECIMAL"){
                            if(search in this.product.marketplace[this.marketplace.id]){
                                value=this.product.marketplace[this.marketplace.id][search]["value"]
                                unit=this.product.marketplace[this.marketplace.id][search]["unit"]
                            }
                        }
                        else{
                            value=this.product.marketplace[this.marketplace.id][search]
                        }
                        if(value==undefined){
                            return text
                        }
                        var re=new RegExp("%"+search+"%",'g')
                        text=text.replace(re,value)
                        if(type=="DECIMAL"){
                            var reUnit=new RegExp("%"+search+"_unit%",'g')
                            text=text.replace(reUnit,unit)
                        }
                        if((type=="TEXT" || type=="CHAR")){
                            var reUpper=new RegExp("%"+search.toUpperCase()+"%",'g')
                            var reTitled=new RegExp("%"+search[0].toUpperCase()+search.slice(1)+"%",'g')
                            
                            text=text.replace(reUpper,value.toUpperCase())
                            text=text.replace(reTitled,value[0].toUpperCase()+value.slice(1))            
                        }
                    
                    }
                    return text
                }
            }
            return text
            
        },

        dragOver(id){
            this["image"+id].isDragging = true;
        },
        dragLeave(id){
            this["image"+id].isDragging = false;
        },

        drop(e,id){
            let files = e.dataTransfer.files
            this["image"+id].wrongFile = false
            // allows only 1 file
            if (files.length === 1) {
            let file = files[0]
            // allows image only
                if (file.type.indexOf('image/') >= 0) {
                    var reader = new FileReader()
                    reader.onload = f => {
                    this.product.marketplace[this.marketplace.id]["image"+id] = f.target.result
                    this["image"+id].isDragging = false
                    }
                    reader.readAsDataURL(file)
                }else{
                    this["image"+id].wrongFile = true
                    this.product.marketplace[this.marketplace.id]["image"+id] = null
                    this["image"+id].isDragging = false
                }
            }
        },
        delImages(i){
            this["image"+i]={isDragging:false,wrongFile:false}
            this.product.marketplace[this.marketplace.id]["image"+i]=null;
        },

        moveImage(i,direction){
            var tmpImageA=this["image"+i];
            var tmpImageB=this.product.marketplace[this.marketplace.id]["image"+i];
            var k=i;
            if(direction=="right"){
                k=i+1;
            }
            else{
                k=i-1;
            }
            this["image"+i]=this["image"+k];
            if(this.product.marketplace[this.marketplace.id]["image"+k]==undefined){
                this.product.marketplace[this.marketplace.id]["image"+i]=null    
            }
            else{
                this.product.marketplace[this.marketplace.id]["image"+i]=this.product.marketplace[this.marketplace.id]["image"+k];
            }
            this["image"+k]=tmpImageA;
            this.product.marketplace[this.marketplace.id]["image"+k]=tmpImageB;
        },


        


        


        async init(){
            this.getCompanies().then(this.getMarketplaces).then(this.getProduct).then(this.getProductCategory).then(this.getItems)
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
        async getMarketplaces(){
            if(this.company!==null){
                try{
                    const res = await this.axios.get("/api/marketplaces/?company="+this.company.id)
                    this.marketplaces=res.data.results;
                    if(res.data.results.length>0){
                        if(this.$route.query.marketplace!=null){
                            for(var i=0; i<res.data.results.length;i++){
                                if(res.data.results[i].id==this.$route.query.marketplace){
                                    this.marketplace=res.data.results[i];
                                }
                            }
                        }
                        else{
                            this.marketplace=res.data.results[0];
                        }
                        this.marketplaceImg="/imgs/"+this.marketplace.code+".png"
                    }
                    else{
                        this.marketplace=null;
                        this.toast.error("Nessun marketplace");
                    }
                }  
                catch (error){
                    this.toast.error("Errore indefinito");
                }  
            }
        },
        
        async getItems(){
            await this.axios.get("/api/warehouse/items/?company="+this.company.id).then((res)=>{
                    this.items=res.data.results;
            }).catch((error)=>{
                this.toast.error("Errore nel recuperare gli articoli del magazzino");
            })
        }, 
        
        async getCategories(){
            await this.axios.get("/api/simplify/products/categories/?company="+this.company.id).then((res)=>{
                    this.categories=res.data.results;
            }).catch((error)=>{
                this.toast.error("Errore nel recuperare le categorie");
            })
        },
        async getProductCategory(){
            const res = await this.axios.get("/api/products/categories/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&simple="+this.$route.query.id).then((res)=>{
                if(res.data.results.length>0){
                    this.category=res.data.results[0];
                    
                    for(var [id,attribute] of Object.entries(this.category.attributes)){
                        if(attribute.type=="DECIMAL"){
                            if(!(attribute.name in this.product.marketplace[this.marketplace.id])){
                                this.product.marketplace[this.marketplace.id][attribute.name]={}
                            }
                        }
                    }
                }

                    
            }).catch((error)=>{
                this.toast.error("Errore nel recuperare la categoria");
            })
        },
        
        


        
        async getProduct(){
            
            
                
                const res = await this.axios.get("/api/products/simple/"+this.$route.query.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
                        
                        
                        this.product.id=res.data.id;
                        this.product.sku=res.data.sku;
                        this.product.gtin_type=res.data.gtin_type;
                        this.product.gtin=res.data.gtin;
                        this.product.item=res.data.item;
                        this.product.marketplace={};
                        this.product.marketplace[this.marketplace.id]={};
                        
                        for(var i=0;i<res.data.char_eav.length;i++){
                            if(res.data.char_eav[i].marketplace == this.marketplace.id){
                                this.product.marketplace[this.marketplace.id][res.data.char_eav[i].attribute]=res.data.char_eav[i].value;
                            }
                        }
                        for(var i=0;i<res.data.text_eav.length;i++){
                            if(res.data.text_eav[i].marketplace == this.marketplace.id){
                                this.product.marketplace[this.marketplace.id][res.data.text_eav[i].attribute]=res.data.text_eav[i].value;
                            }
                        }
                        for(var i=0;i<res.data.url_eav.length;i++){
                            if(res.data.url_eav[i].marketplace == this.marketplace.id){
                                this.product.marketplace[this.marketplace.id][res.data.url_eav[i].attribute]=res.data.url_eav[i].value;
                            }
                        }
                        for(var i=0;i<res.data.int_eav.length;i++){
                            if(res.data.int_eav[i].marketplace == this.marketplace.id){
                                this.product.marketplace[this.marketplace.id][res.data.int_eav[i].attribute]=res.data.int_eav[i].value;
                            }
                        }
                        for(var i=0;i<res.data.boolean_eav.length;i++){
                            if(res.data.boolean_eav[i].marketplace == this.marketplace.id){
                                this.product.marketplace[this.marketplace.id][res.data.boolean_eav[i].attribute]=res.data.boolean_eav[i].value;
                            }
                        }
                        for(var i=0;i<res.data.decimal_eav.length;i++){
                            if(res.data.decimal_eav[i].marketplace == this.marketplace.id){
                                this.product.marketplace[this.marketplace.id][res.data.decimal_eav[i].attribute]={}
                                this.product.marketplace[this.marketplace.id][res.data.decimal_eav[i].attribute]["value"]=res.data.decimal_eav[i].value;
                                this.product.marketplace[this.marketplace.id][res.data.decimal_eav[i].attribute]["unit"]=res.data.decimal_eav[i].unit;
                            }
                        }
                        
                         
                        
                        this.ready=true;
                }).catch((error)=>{
                    this.toast.error(error);
                })
            
        },
        changeCompany(index){
            window.location.href='/products/simple?company='+this.companies[index].id;
            
        },
        changeMarketplace(event){
            window.location.href='/products/simple?company='+this.company.id+'&marketplace='+event.target.value
        },
        
        
        
        saveProduct(){
            
            this.axios.put("/api/products/simple/"+this.product.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,this.product).then((res)=>{
                this.toast.success("Prodotto salvato");
                this.getProduct().then(this.getProductCategory)
            }).catch((error)=>{
                this.toast.error(error.response.data.detail)
            })
            
            
            
        },

        async getAbstractProductsTo(){
            this.axios.get("/api/abstract/simple/?company="+this.company.id+"&marketplace="+this.marketTo).then((res)=>{
              this.abstractProductsTo["simple"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/configurable/?company="+this.company.id+"&marketplace="+this.marketTo).then((res)=>{
              this.abstractProductsTo["configurable"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/multiple/?company="+this.company.id+"&marketplace="+this.marketTo).then((res)=>{
              this.abstractProductsTo["multiple"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            })
            this.axios.get("/api/abstract/bulk/?company="+this.company.id+"&marketplace="+this.marketTo).then((res)=>{
              this.abstractProductsTo["bulk"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            })
        },
        async getAbstractProductsFrom(){
            this.axios.get("/api/abstract/simple/?company="+this.company.id+"&marketplace="+this.marketFrom).then((res)=>{
              this.abstractProductsFrom["simple"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/configurable/?company="+this.company.id+"&marketplace="+this.marketFrom).then((res)=>{
              this.abstractProductsFrom["configurable"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            });
            this.axios.get("/api/abstract/multiple/?company="+this.company.id+"&marketplace="+this.marketFrom).then((res)=>{
              this.abstractProductsFrom["multiple"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            })
            this.axios.get("/api/abstract/bulk/?company="+this.company.id+"&marketplace="+this.marketFrom).then((res)=>{
              this.abstractProductsFrom["bulk"]=res.data.results;
            }).catch((error)=>{
                this.toast.error(error);
            })
        },
        
        filtersReset(){
            this.filters={
                sku:{ value:"", action:"==",active:false},
                title:{ value:"", action:"cc", active:false},
                description:{value:"", action:"cc", active:false},
                short_description:{value:"", action:"cc", active:false},
                images:{ value:true,  active:false},
                attributes:{value:[], active:false}
            }
            this.getProducts(this.marketplaceKey);
        },
        resetOtherProductFrom(except){
            for(var key of Object.keys(this.productFrom)){
                if(except!==key){
                    this.productFrom[key]=null
                }
            }
            
            
        },
        copyToProducts(){

            var data={}
            data["marketplace"]=this.marketTo
            data["fields"]=[]
            for(var [key,value] of Object.entries(this.copyTo)){
                if(value){
                    data["fields"].push(key);
                }
            }
            data["products"]={}
            data["products"]["simple"]=[]
            for(var [key,value] of Object.entries(this.productsTo.simple)){
                if(value){
                    data["products"]["simple"].push(value);
                }
            }
            data["products"]["configurable"]=[]
            for(var [key,value] of Object.entries(this.productsTo.configurable)){
                if(value){
                    data["products"]["configurable"].push(value);
                }
            }
            data["products"]["multiple"]=[]
            for(var [key,value] of Object.entries(this.productsTo.multiple)){
                if(value){
                    data["products"]["multiple"].push(value);
                }
            }
            data["products"]["bulk"]=[]
            for(var [key,value] of Object.entries(this.productsTo.bulk)){
                if(value){
                    data["products"]["bulk"].push(value);
                }
            }
            data["overwrite"]=this.overwriteTo
            
            this.axios.put("/api/copy/to/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&product="+this.product.id,data).then((res)=>{
                this.toast.success("Copia effettuata");                
            }).catch((error)=>{
                this.toast.error(error.response.data.detail)
            })
            
            
        },
        copyFromProduct(){
            var data={}
            
            data["product"]=this.productFrom
            data["marketplace"]=this.marketFrom
            data["overwrite"]=this.overwriteFrom
            data["fields"]=[]
            for(var [key,value] of Object.entries(this.copyFrom)){
                if(value){
                    data["fields"].push(key);
                }
            }
            
            this.axios.put("/api/copy/from/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&product="+this.product.id,data).then((res)=>{
                this.toast.success("Copia effettuata");                
            }).catch((error)=>{
                this.toast.error(error.response.data.detail)
            })
        },
    
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>

<style scoped>
#left-col{
    position:fixed;
    width:900px;
    right:var(--right-width);
    padding:20px;
    
    color: rgb(26, 26, 26);
    min-height:100px;

    background:linear-gradient(white, white) padding-box, border-box;
    
  box-shadow: 15px 15px 15px 0px #000000;
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
.drop{
    width: 100px;
    height: 100px;
    background-size:70px;
    background-position:center;
    background-repeat:no-repeat;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: background-color .2s ease-in-out;
    text-align:center;
    -webkit-box-shadow: 5px 5px 10px 0px #000000;
    -moz-box-shadow: 5px 5px 10px 0px #000000;
    -o-box-shadow: 5px 5px 10px 0px #000000;
    box-shadow: 5px 5px 10px 0px #000000;

}

.boxed{
  -webkit-box-shadow: 5px 5px 10px 0px #000000;
-moz-box-shadow: 5px 5px 10px 0px #000000;
-o-box-shadow: 5px 5px 10px 0px #000000;
box-shadow: 5px 5px 10px 0px #000000;
}
.drop .isDragging{
  background-color: #999;
  border-color: #fff;
  width: 100px;
    height: 100px;
}
.drop img{
  
  height: 70px;
  object-fit: contain;
}
.table-general th{
    width:20%;
}
.table-general th, .table-general td, .table-general  tr{
    padding-top:0px;
    padding-bottom:0px;
}
</style>