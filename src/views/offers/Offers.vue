<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }" >
          <section  class="content" id="content" >
  
  
          <div class="content__header content__boxed overlapping">
              <div class="content__wrap">
  
                      <!-- Page title and information -->
                      <h1 class="page-title mb-2">Offerte</h1>
                      <h2 class="h5">Stato delle tue offerte</h2>
                      <p></p>
                      <!-- END : Page title and information -->
              </div>
          </div>
          <div class="content__boxed" style="height: 80vh; overflow-y: scroll;">
              <div class="content__wrap">
                  
                  
                    <div class="row p-2 bg-light">
                        <div class="col-4">
                            <b>Tipo di Scheda Prodotto</b>      
                            <select class="form-select mr-2" v-model="this.productType" v-on:change="this.changeProductType();">
                                  <option value="simple">Semplici</option>
                                  <option value="multiple">Multipli</option>
                                  <option value="bulk">Composti</option>
                              </select>
                        </div>
                        <div class="col-4"></div>
                        <div class="col-4 d-md-flex justify-content-md-end m-auto ">
                            <b>Azioni massive</b>
                            <button class="btn btn-primary ms-2" v-on:click="this.showMassive=!this.showMassive"><template v-if="!this.showMassive">Mostra</template><template v-else>Nascondi</template></button>
                        </div>
                        
                    </div>
                    <div class="row p-2 bg-light">

                        <div class="col-4 m-auto">
                            <b>Cerca</b>
                                        <div class="input-group">
                                            <input type="text" class="form-control"  placeholder="codice/nome (3 caratteri min.)" v-on:keyup.enter="this.sendSearch()" v-model="this.search">
                                            <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.sendSearch()">Cerca</button></div>
                                        </div>
                          </div>
                          <div class="col-4"></div>
                          
                          <div class="col-4 m-auto me-0">
                              <b>Visualizza righe (n.)</b>
                              <select class="form-select mr-2" v-on:change="this.offset=0; this.limit=$event.target.value; this.getOffers();">
                                  <option value="20">20</option>
                                  <option value="50">50</option>
                                  <option value="100">100</option>
                                  <option value="200">200</option>
                              </select>
                          </div>
                      </div>
                      
                      <div class="row p-2 card mt-1" v-if="this.showMassive" style="border:5px; border-style:solid; border-color:#25476a;" >
                        <div class="card-header row col-12">
                            <div class="col-6">
                                <div class="card-title"><h6>Azioni massive</h6></div>
                                <div class="card-category"><b class="text-primary">Selezionando</b> le righe e le colonne puoi applicare una modifica in modo massivo.<br/>Le <b class="text-primary">celle evidenziate</b> indicheranno l'obbiettivo della modifica<br/>La modifica verrà effettuata <b class="text-primary">solo dopo aver premuto il tasto "Esegui"</b></div>
                            </div>
                            <div class="col-6 d-md-flex justify-content-md-end m-auto">
                                <button class="btn btn-primary" v-on:click="this.saveMassive()">Esegui</button>
                            </div>
                        </div>
                        <div class="card-body row">
                            <div class="col-2 pe-4">
                                <b>Offerta</b>
                                <div class="input-group">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Attiva/disattiva</b></span></div>
                                        <input type="checkbox" class="form-check-input p-2 m-auto" v-model="this.enableIsActive">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setEnableIsActive()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                <b>Prezzo</b>
                                <div class="input-group">
                                    <div class="input-group-prepend p-2"><span class="text-primary"><b>Nuovo prezzo €</b></span></div>
                                    <input type="text" class="form-control" v-model="this.newPrice" v-on:keyup="this.newPrice = this.newPrice.replace(/[^0-9.]/g, ''); this.newPrice = this.newPrice.replace(/(\..*)\./g,'$1');">
                                    <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setNewPrice()"><i class="bi-pencil"></i></button></div>
                                    
                                </div>
                                <div class="input-group mt-1">
                                    <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica € +/-</b></span></div>
                                    <input type="text" class="form-control" v-model="this.addNewPriceEuro" v-on:keyup="this.addNewPriceEuro = this.addNewPriceEuro.replace(/[^0-9.]/g, ''); this.addNewPriceEuro = this.addNewPriceEuro.replace(/(\..*)\./g,'$1');">
                                    <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddNewPriceEuro()"><i class="bi-pencil"></i></button></div>
                                    
                                </div>
                                <div class="input-group mt-1">
                                    <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica % +/-</b></span></div>
                                    <input type="text" class="form-control" v-model="this.addNewPricePercent"  v-on:keyup="this.addNewPricePercent = this.addNewPricePercent.replace(/[^0-9]/g, ''); this.addNewPricePercent = this.addNewPricePercent.replace(/(\..*)\./g, '$1');">
                                    <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddNewPricePercent()"><i class="bi-pencil"></i></button></div>
                                    
                                </div>
                            </div>
                            <div class="col-2 row pe-4" style="border-left:1px solid #25476a;">
                                <b>IVA</b>
                                <div class="col-12 m-auto mt-0">
                                    (Seleziona un solo Marketplace)
                                    <div class="input-group">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Seleziona IVA</b></span></div>
                                        <select class="form-select" v-model="this.newIVA" :disabled="!this.massiveIvaMarket">
                                            <option v-for="(iva,key) in this.ivas[massiveIvaMarket]" :key="key" :value="iva.id">{{iva.code}} - {{ iva.percentage }}%</option>
                                        </select>
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setNewIVA()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>

                                </div>
                            </div>
                            <div class="col-4 row pe-4" style="border-left:1px solid #25476a;">
                                <b>Prezzo minimo/massimo</b>
                                <div class="col-6">
                                    <div class="input-group">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Attiva/disattiva</b></span></div>
                                        <input type="checkbox" class="form-check-input p-2 m-auto" v-model="this.enableMinMax">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setEnableMinMax()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                </div>
                                <div class="col-6"></div>
                                <div class="col-6">
                                    <b>Minimo</b>
                                    <div class="input-group">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Nuovo prezzo €</b></span></div>
                                        <input type="text" class="form-control" v-model="this.newPriceMin" v-on:keyup="this.newPriceMin = this.newPriceMin.replace(/[^0-9.]/g, ''); this.newPriceMin = this.newPriceMin.replace(/(\..*)\./g,'$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setNewPriceMin()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica € +/-</b></span></div>
                                        <input type="text" class="form-control" v-model="this.addPriceMinEuro" v-on:keyup="this.addPriceMinEuro = this.addPriceMinEuro.replace(/[^0-9.]/g, ''); this.addPriceMinEuro = this.addPriceMinEuro.replace(/(\..*)\./g,'$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddPriceMinEuro()"><i class="bi-pencil"></i></button></div>
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica % +/-</b></span></div>
                                        <input type="text" class="form-control" v-model="this.addPriceMinPercent"  v-on:keyup="this.addPriceMinPercent = this.addPriceMinPercent.replace(/[^0-9]/g, ''); this.addPriceMinPercent = this.addPriceMinPercent.replace(/(\..*)\./g, '$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddPriceMinPercent()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                    
                                </div>
                                <div class="col-6">
                                    <b>Massimo</b>
                                    <div class="input-group">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Nuovo prezzo €</b></span></div>
                                        <input type="text" class="form-control" v-model="this.newPriceMax" v-on:keyup="this.newPriceMax = this.newPriceMax.replace(/[^0-9.]/g, ''); this.newPriceMax = this.newPriceMax.replace(/(\..*)\./g,'$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setNewPriceMax()" ><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica € +/-</b></span></div>
                                        <input type="text" class="form-control" v-model="this.addPriceMaxEuro" v-on:keyup="this.addPriceMaxEuro = this.addPriceMaxEuro.replace(/[^0-9.]/g, ''); this.addPriceMaxEuro = this.addPriceMaxEuro.replace(/(\..*)\./g,'$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddPriceMaxEuro()" ><i class="bi-pencil"></i></button></div>
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica % +/-</b></span></div>
                                        <input type="text" class="form-control" v-model="this.addPriceMaxPercent" v-on:keyup="this.addPriceMaxPercent = this.addPriceMaxPercent.replace(/[^0-9]/g, ''); this.addPriceMaxPercent = this.addPriceMaxPercent.replace(/(\..*)\./g, '$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddPriceMaxPercent()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                </div>
                                
                            </div>
                            <div class="col-4 row pe-4" style="border-left:1px solid #25476a;">
                                <b>Sconto/In Offerta</b>
                                <div class="col-6">
                                    <div class="input-group">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Attiva/disattiva</b></span></div>
                                        <input type="checkbox" class="form-check-input p-2 m-auto" v-model="this.enableOffer">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setEnableOffer()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Data inizio</b></span></div>
                                        <input type="date" class="form-control" v-model="this.startDateOffer">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setStartDateOffer()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Data fine</b></span></div>
                                        <input type="date" class="form-control" v-model="this.endDateOffer">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setEndDateOffer()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                    
                                </div>
                                <div class="col-6">
                                    <div class="input-group">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Nuovo prezzo €</b></span></div>
                                        <input type="text" class="form-control" v-model="this.newPriceOffer" v-on:keyup="this.newPriceOffer = this.newPriceOffer.replace(/[^0-9.]/g, ''); this.newPriceOffer = this.newPriceOffer.replace(/(\..*)\./g,'$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setNewPriceOffer()" ><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica € +/-</b></span></div>
                                        <input type="text" class="form-control" v-model="this.addPriceOfferEuro" v-on:keyup="this.addPriceOfferEuro = this.addPriceOfferEuro.replace(/[^0-9.]/g, ''); this.addPriceOfferEuro = this.addPriceOfferEuro.replace(/(\..*)\./g,'$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddPriceOfferEuro()" ><i class="bi-pencil"></i></button></div>
                                    </div>
                                    <div class="input-group mt-1">
                                        <div class="input-group-prepend p-2"><span class="text-primary"><b>Modifica % +/-</b></span></div>
                                        <input type="text" class="form-control" v-model="this.addPriceOfferPercent" v-on:keyup="this.addPriceOfferPercent = this.addPriceOfferPercent.replace(/[^0-9]/g, ''); this.addPriceOfferPercent = this.addPriceOfferPercent.replace(/(\..*)\./g, '$1');">
                                        <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.setAddPriceOfferPercent()"><i class="bi-pencil"></i></button></div>
                                        
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>

                      </div>
                      <div class="row p-2 bg-light mt-1">
                        <div class="col-3">
                            <div class="m-auto mb-4 d-md-flex justify-content-md-start">
                                <b class="p-2">Offerte </b>
                                <button class="pt-1 pb-0 btn btn-primary" v-if="this.previous" v-on:click="this.offset=this.offset-this.limit; this.getOffers()">&lt;&lt;</button>
                                <b class="m-2">{{parseFloat(this.offset)+1}} - {{parseFloat(this.offset)+parseFloat(this.limit)}}</b>
                                <button class="pt-1 pb-0 btn btn-primary" v-if="this.next" v-on:click="this.offset=this.offset+this.limit; this.getOffers()">&gt;&gt;</button>
                            </div>
                            <div>
                                <span v-if="nselected>0" style="color:red;">{{nselected}} di {{count}} Selezionati</span><span v-else>{{nselected}} di {{count}} Selezionati </span><br/>
                                

                            </div>
                        </div>
                                  <div class="col-5 d-md-flex justify-content-md-end">
                                    <div class="col-10">
                                        
                                        
                                    </div>

                                  </div>
                                       
                                  
                                  <div class="col-4 d-md-flex justify-content-md-end">
                                    <div class="col-8">
                                        
                                    </div>
                                </div>
                                      
                                  
                                  <hr/>
                      </div>
                  <div class="row p-2 mt-2 bg-light" >
                          <div class="col-12 mt-4 pt-4" v-if="loading"><span class="spinner-border  text-warning" role="status"></span></div>
                          
                          <table v-if="!loading" class="table table-striped table-sm" >
                              <thead>
                                    <tr>
                                        <th class="p-2" style="width:20px; max-width:20px;">
                                            <input type="checkbox" class="form-check-input" v-model="this.checkboxAllSku" v-on:change="this.selectAllSku()">
                                        </th>
                                        <th style="width:100px; max-width:100px;">
                                            <div class="row">
                                                
                                                <div class="col-9">
                                                    <h5>SKU</h5>
                                                </div>
                                            </div>
                                        </th>
                                        <th v-for="market,key in this.marketplaces" :key="key" :class="{ 'hwfix' : this.columns[market.id],'hwfixsmall' : !this.columns[market.id], 'bg-warning': this.marketSelected[market.id]}">
                                            <div class="row">
                                                <template v-if="this.columns[market.id]">
                                                    <div class="col-2 m-auto">
                                                        <span class="text-primary me-3"><b>Seleziona</b></span>
                                                        <input type="checkbox" class=" form-check-input" v-model="this.marketSelected[market.id]">
                                                    </div>
                                                    <div class="col-8 m-auto d-md-flex justify-content-md-center">
                                                        <h5 class="m-auto">{{market._code}}/{{market._country}} ({{ market.account }})</h5>
                                                    </div>
                                                    <div class="col-2 d-md-flex justify-content-md-end">
                                                        <button class="btn btn-outline text-primary" v-on:click="this.columns[market.id]=!this.columns[market.id]"><b v-if="this.columns[market.id]" class="bi-arrow-bar-left">Riduci</b><b v-else class="bi-arrow-bar-right">Espandi</b></button>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="col-5 m-auto">
                                                        <span class="text-primary me-3"><b>Seleziona</b></span>
                                                        <input type="checkbox" class=" form-check-input" v-model="this.marketSelected[market.id]">
                                                    </div>
                                                    <div class="col-2 m-auto d-md-flex justify-content-md-center">
                                                        <h5 class="m-auto">{{market.code}}/{{market.country}}</h5>
                                                    </div>
                                                    <div class="col-5 d-md-flex justify-content-md-end">
                                                        <button class="btn btn-outline text-primary" v-on:click="this.columns[market.id]=!this.columns[market.id]"><b v-if="this.columns[market.id]" class="bi-arrow-bar-left">Riduci</b><b v-else class="bi-arrow-bar-right">Espandi</b></button>
                                                    </div>
                                                </template>
                                            </div>
                                        </th>
                                    </tr>
                              </thead>
                              <tbody>
                                  <template v-for="(product,sku) in this.offers" :key="sku">
                                      <tr style="border:1px solid grey">
                                          <td :class="{ 'bg-warning' : this.skuSelected[sku]}"><input type="checkbox" class="form-check-input" v-model="this.skuSelected[sku]"></td>
                                          <th :class="{ 'bg-warning' : this.skuSelected[sku]}">{{sku}}</th>
                                          <td style="border-left:3px solid grey;" :class="{'bg-warning': this.checkboxSelected[sku][market.id]}" class="p-3" v-for="market,key in this.marketplaces" :key="key">
                                            <template v-if="this.ivas[market.id]">
                                                <template v-if="market.id in product.marketplaces">
                                                    <template v-if="(this.productType=='simple' && product.marketplaces[market.id].item) || (this.productType=='multiple' && product.marketplaces[market.id].child && product.marketplaces[market.id].child.item)">
                                                        <template v-if="this.columns[market.id]">
                                                            <table class="table-sm card m-auto">
                                                                <tr>
                                                                    <td>
                                                                        <div class="row">
                                                                            <template v-if="this.productType=='simple'">
                                                                                <b>Articolo Inventario</b>
                                                                                <a :href="'/item/?id='+product.marketplaces[market.id].item.id+'&company='+this.company.id">{{product.marketplaces[market.id].item.item_code}}<br/>{{product.marketplaces[market.id].item.name}}</a>
                                                                            </template>
                                                                            <template v-else-if="this.productType=='multiple'">
                                                                                
                                                                                    <b>Articolo Inventario: <a :href="'/item/?id='+product.marketplaces[market.id].child.item.id+'&company='+this.company.id">{{product.marketplaces[market.id].child.item.item_code}}</a></b>
                                                                                    <hr/>
                                                                                    <b>Scheda prodotto figlio: <a :href="'/product/simple/?id='+product.marketplaces[market.id].child.id+'&company='+this.company.id">{{product.marketplaces[market.id].child.sku}}</a></b>
                                                                                    <hr/>
                                                                                                                                                                
                                                                            </template>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <div class="row">
                                                                            <b>Scheda prodotto</b>
                                                                            <template v-if="this.productType=='simple'">
                                                                                <a :href="'/product/simple/?id='+product.marketplaces[market.id].product+'&company='+this.company.id+'&marketplace='+market.id">{{sku}}<br/>{{product.marketplaces[market.id].title}}</a>
                                                                            </template>
                                                                            <template v-else-if="this.productType=='multiple'">
                                                                                <a :href="'/product/multiple/?id='+product.marketplaces[market.id].product+'&company='+this.company.id+'&marketplace='+market.id">{{sku}}<br/>{{product.marketplaces[market.id].title}}</a>
                                                                            </template>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                    <div class="row">
                                                                        <div class="col-8">
                                                                            <b>Prezzo (iva inclusa)</b>
                                                                            <input type="text" v-model="product.marketplaces[market.id].offer.price" class="form-control" v-on:keyup="product.marketplaces[market.id].offer.price = product.marketplaces[market.id].offer.price.replace(/[^0-9.]/g, ''); product.marketplaces[market.id].offer.price = product.marketplaces[market.id].offer.price.replace(/(\..*)\./g,'$1');">
                                                                        </div>
                                                                        <div class="col-4">
                                                                            <b>Iva [Cod.- %]</b>
                                                                            <template v-if="this.ivas[market.id]">
                                                                                <select v-model="product.marketplaces[market.id].offer.iva" class="form-select">
                                                                                        <option v-for="(iva,key) in this.ivas[market.id]" :key="key" :value="iva.id">{{iva.code}} - {{ iva.percentage }}%</option>
                                                                                </select>
                                                                            </template>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    
                                                                    <td>
                                                                        <div class="row">
                                                                            <div class="col-2 m-auto d-md-flex justify-content-md-center">
                                                                                
                                                                                <b>On/Off</b>
                                                                                <input type="checkbox" class="form-check-input m-2" :disabled="!product.marketplaces[market.id].offer.offer_price || !product.marketplaces[market.id].offer.start_offer || !product.marketplaces[market.id].offer.end_offer" v-model="product.marketplaces[market.id].offer.offer_is_active" >
                                                                            </div>
                                                                            <div class="col-4">
                                                                                <b>Prezzo In Offerta (iva incl.)</b>
                                                                                <input type="text" v-model="product.marketplaces[market.id].offer.offer_price" v-on:keyup="product.marketplaces[market.id].offer.offer_price = product.marketplaces[market.id].offer.offer_price.replace(/[^0-9.]/g, ''); product.marketplaces[market.id].offer.offer_price = product.marketplaces[market.id].offer.offer_price.replace(/(\..*)\./g,'$1');" class="form-control">
                                                                            </div>
                                                                            <div class="col-3">
                                                                                <b>Data di inizio</b>
                                                                                <input type="date" class="form-control" v-model="product.marketplaces[market.id].offer.start_offer">        
                                                                            </div>
                                                                            <div class="col-3">
                                                                                <b>Data di fine</b>
                                                                                <input type="date" class="form-control" v-model="product.marketplaces[market.id].offer.end_offer">
                                                                            </div>
                                                                        </div>
                                                                        
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <div class="row">
                                                                            <div class="col-2 m-auto d-md-flex justify-content-md-center">
                                                                                
                                                                                    <b>On/Off</b>
                                                                                    <input type="checkbox" class="form-check-input ms-2" :disabled="!product.marketplaces[market.id].offer.min_price || !product.marketplaces[market.id].offer.max_price || (parseFloat(product.marketplaces[market.id].offer.max_price)<parseFloat(product.marketplaces[market.id].offer.price)) || (parseFloat(product.marketplaces[market.id].offer.min_price)>parseFloat(product.marketplaces[market.id].offer.price))  " v-model="product.marketplaces[market.id].offer.is_min_max">
                                                                            </div>
                                                                            <div class="col-5">
                                                                                <b>Prezzo minimo (iva incl.)</b>
                                                                                <input type="text" class="form-control" :class="{ 'bg-danger' : parseFloat(product.marketplaces[market.id].offer.min_price) > parseFloat(product.marketplaces[market.id].offer.price) }"  v-model="product.marketplaces[market.id].offer.min_price" v-on:keyup="product.marketplaces[market.id].offer.min_price = product.marketplaces[market.id].offer.min_price.replace(/[^0-9.]/g, ''); product.marketplaces[market.id].offer.min_price = product.marketplaces[market.id].offer.min_price.replace(/(\..*)\./g,'$1');">
                                                                            </div>
                                                                            <div class="col-5">
                                                                                <b>Prezzo massimo (iva incl.)</b>
                                                                                <input type="text" class="form-control" :class="{ 'bg-danger' : product.marketplaces[market.id].offer.is_min_max && product.marketplaces[market.id].offer.max_price && parseFloat(product.marketplaces[market.id].offer.max_price)<parseFloat(product.marketplaces[market.id].offer.price) }" v-model="product.marketplaces[market.id].offer.max_price" v-on:keyup="product.marketplaces[market.id].offer.max_price = product.marketplaces[market.id].offer.max_price.replace(/[^0-9.]/g, ''); product.marketplaces[market.id].offer.max_price = product.marketplaces[market.id].offer.max_price.replace(/(\..*)\./g,'$1');">
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                        <div class="row col-12 p-2 m-auto">
                                                                            <div class="col-6 m-auto d-md-flex justify-content-md-start p-2" >
                                                                                <b>Attiva/Disattiva</b>
                                                                                <input type="checkbox" class=" ms-2 form-check-input" v-model="product.marketplaces[market.id].offer.is_active">
                                                                            </div>
                                                                            <div class="col-6 d-md-flex justify-content-md-end">
                                                                                <template v-if="(product.marketplaces[market.id].offer.price && product.marketplaces[market.id].offer.iva) || !product.marketplaces[market.id].offer.is_active">
                                                                                    <button class="btn btn-primary" v-on:click="saveOffer(sku,product.marketplaces[market.id].offer.id,product.marketplaces[market.id].product,market.id)">Salva</button>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <button class="btn btn-danger" disabled >Salva</button>
                                                                                </template>
                                                                                
                                                                            </div>
        
                                                                        </div>
                                                                </tr>
                                                            </table>
                                                        </template>

                                                        <template v-else>
                                                            <h6>€ {{product.marketplaces[market.id].offer.price}}</h6>
                                                        </template>
                                                        
                                                    </template>
                                                    <template v-else>
                                                        <div class="row">
                                                            <template v-if="this.productType=='simple'">
                                                                <div class="col-9">
                                                                    <h6>Articolo Magazzino non associato per questo Marketplace</h6>
                                                                    Vai alla scheda prodotto di <b>{{sku}}</b>
                                                                </div>
                                                                <div class="col-3">
                                                                    <a class="btn btn-warning" :href="'/product/simple/?id='+product.marketplaces[market.id].product+'&company='+this.company.id+'&marketplace='+market.id">VAI</a>
                                                                </div>
                                                            </template>
                                                            <template v-if="this.productType=='multiple'">
                                                                <template v-if="!product.marketplaces[market.id].child">
                                                                    <div class="col-9">
                                                                        <h6>Scheda prodotto figlio non associata per questo Marketplace</h6>
                                                                        Vai alla scheda prodotto di <b>{{sku}}</b>
                                                                    </div>
                                                                    <div class="col-3">
                                                                        <a class="btn btn-warning" :href="'/product/multiple/?id='+product.marketplaces[market.id].product+'&company='+this.company.id+'&marketplace='+market.id">VAI</a>
                                                                    </div>
                                                                </template>
                                                                <template v-else-if="!product.marketplaces[market.id].child.item">
                                                                    <div class="col-9">
                                                                        <h6>Articolo di magazzino non associato al prodotto figlio</h6>
                                                                        Vai alla scheda prodotto di <b>{{product.marketplaces[market.id].child.sku}}</b>
                                                                    </div>
                                                                    <div class="col-3">
                                                                        <a class="btn btn-warning" :href="'/product/simple/?id='+product.marketplaces[market.id].child.id+'&company='+this.company.id+'&marketplace='+market.id">VAI</a>
                                                                    </div>
                                                                </template>
                                                                
                                                            </template>
                                                        </div>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <div class="row">
                                                        <div class="col-9">
                                                            <h6>La scheda prodotto non esiste per questo Marketplace</h6>
                                                        Crea una nuova scheda prodotto
                                                        </div>
                                                        <div class="col-3">
                                                            <a class="btn btn-primary" :href="'/product/new/&company='+this.company.id">Crea</a>

                                                        </div>
                                                    </div>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <div class="row">
                                                        <div class="col-9">
                                                            <h6>Non hai ancora creato i codici IVA in questo Marketplace</h6>
                                                        Crea i codici IVA
                                                        </div>
                                                        <div class="col-3">
                                                            <a class="btn btn-danger" title="Crea i codici IVA per questo Marketplace" :href="'/ivas/?company='+this.company.id+'&marketplace='+market.id"><b>VAI</b></a>
                                                        </div>
                                                    </div>            
                                            </template>
                                        </td>
                                    </tr>
                                    
                                </template>
                                  
                                  
                                          
                                          
                                          
                                          
                            </tbody>
                        </table>
                  </div>
              </div>
             
              
      </div>
      <Footer/>
          </section>
              
  
          <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
          <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="offers" @update:collapse="(collapse=false)"/>
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
              search:"",
              offers:[],
              showAll:false,
              marketplaces:[],
              marketplace:"",
              
              company:{},
              companies:[],
              productType:"simple",
              
              columns:{},
              ivas:{},
              loading:false,
  
            showMassive:false,
              checkboxSelected:{},
            checkboxAllSku:{},
              count:null,
              limit:20,
              offset:0,
              previous:null,
              next:null,
  
              actionToDo:null,
              skuSelected:{},
              marketSelected:{},
              

              enableIsActive:false,
              newPrice:null,
              addNewPricePercent:null,
              addNewPriceEuro:null,
              newIVA:null,
              enableMinMax:false,
              newPriceMin:null,
              newPriceMax:null,
              addPriceMinEuro:null,
              addPriceMaxEuro:null,
              addPriceMinPercent:null,
              addPriceMaxPercent:null,
              enableOffer:null,
              startDateOffer:null,
              endDateOffer:null,
              newPriceOffer:null,
              addPriceOfferEuro:null,
              addPriceOfferPercent:null,
  
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
        nselected(){
                  var i=0;

                  for (var [sku,valuea] of Object.entries(this.skuSelected)){
                    for (var [market,valueb] of Object.entries(this.marketSelected)){
                        if (valuea && valueb){
                            if(this.offers[sku]["marketplaces"][market]!=null){
                                if(this.offers[sku]["marketplaces"][market]["item"]!=null && this.ivas[market]){
                                    this.checkboxSelected[sku][market]=true;
                                }    
                            }
                        }
                        else{
                            this.checkboxSelected[sku][market]=false;
                        }
                    }
                  }


                  for(var [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(var value of Object.values(obj)){
                        if(value){
                            i++;
                        }
                    }
                  }
                  return i;
        },
        massiveIvaMarket(){
            this.newIVA=null;
            var i=0;
            let idx=null
            for(let [id,value] of Object.entries(this.marketSelected)){
                if(value){
                    idx=id;
                    i++;
                }
            }
            if(i==1){

                return idx
            }
            return false
        },
          
          },
          
      methods:{
        selectAllSku(){
            for(var sku of Object.keys(this.skuSelected)){
                this.skuSelected[sku]=this.checkboxAllSku
            }
        },  
        async changeProductType(){
            this.loading=true;
            this.offset=0;
            this.limit=20;
            this.getMarketplaces().then(this.getIvas).then(this.getOffers);
        },
          async init(){
              this.getCompanies().then(this.getMarketplaces).then(this.getIvas).then(this.getOffers)
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
                      })
                  }
                  catch(error) {
                      if(error.response!=null){
                          this.toast.erroritem_code=models.CharField(max_length=50)(error.response.data.detail);
                      }
                      else{
                          this.toast.error("Errore indefinito");
                      }
                  };
  
          },
          async getOffers() {

            try{
                    this.checkboxSelected={}
                    this.skuSelected={}
                    
                    const res = await this.axios.get("/api/simplify/offers/?company="+this.company.id+"&limit="+this.limit+"&offset="+this.offset+"&search="+this.search+"&type="+this.productType).then((res) => {
                        this.offers=res.data.results;
                        for(let [sku,marketObj] of Object.entries(this.offers)){
                            this.checkboxSelected[sku]={}
                            this.skuSelected[sku]=false
                            for(let marketId of Object.keys(marketObj.marketplaces)){
                                this.checkboxSelected[sku][marketId]=false;
                            }
                        }
                        this.count=res.data.count;
                        this.previous=res.data.previous;
                        this.next=res.data.next;
                        this.loading=false;
                    });
            }
            catch(error){
                this.toast.error("Errore indefinito");
            }
        
            
        },
        async getIvas() {
            try{
               

                    await this.axios.get("/api/ivas/?company="+this.company.id+"&limit=1000&offset=0").then((res) => {
                        this.ivas={}
                        for(let i=0;i<res.data.results.length;i++){
                            if(!(res.data.results[i].marketplace in this.ivas)){
                                this.ivas[res.data.results[i].marketplace]=[];
                            }
                            this.ivas[res.data.results[i].marketplace].push(res.data.results[i])
                        }
                    });
            }
            catch(error){
                this.toast.error("Errore indefinito");
            }
        
            
        },
        //   async getItems() {
        //     try{
               

        //             const res = await this.axios.get("/api/warehouse/items/?company="+this.company.id+"&limit="+this.limit+"&offset="+this.offset+"&search="+this.search).then((res) => {
        //                 this.items=res.data.results;
        //                 this.count=res.data.count;
        //                 this.loading=false;
        //             });
        //     }
        //     catch(error){
        //         this.toast.error("Errore indefinito");
        //     }
        
            
        // },
          async getMarketplaces(){
            if(this.company!==null){
                try{
                    const res = await this.axios.get("/api/marketplaces/?company="+this.company.id)
                    this.marketplaces=res.data.results;
                    for(var i=0;i<this.marketplaces.length;i++){
                        this.columns[this.marketplaces[i].id]=true;
                        this.marketSelected[this.marketplaces[i].id]=false;
                    }
                    
                }  
                catch (error){
                    this.toast.error("Errore indefinito");
                }  
            }
            
        },
          
          
          sendSearch(){
              if(this.search.length==0 || this.search.length>2){
                  this.changeProductType()
              }
          },




          saveOffer(sku,id,productId,marketId){
            
            let offer=this.offers[sku]["marketplaces"][marketId]["offer"]
            offer["product"]=productId
            offer["marketplace"]=marketId
            offer["company"]=this.company.id
            if(offer["price"]==null || offer["price"]=="" || offer["price"]==undefined){
                this.toast.error("Devi inserire il prezzo")
                return
            }
            if(offer["iva"]==null || offer["iva"]=="" || offer["iva"]==undefined){
                this.toast.error("Devi inserire l'IVA")
                return
            }
            if(id==null || id==undefined){
                this.axios.post("/api/offers/"+this.productType+"/?company="+this.company.id,offer).then((res) => {
                      this.toast.success("Offerta salvata")
                      this.offers[sku]["marketplaces"][marketId]["offer"]=res.data
                      
                  }).catch((error)=>{
                      this.toast.error(error.response.detail)
                  })
            }
            else{
                this.axios.put("/api/offers/"+this.productType+"/"+id+"/?company="+this.company.id,offer).then((res) => {
                      this.toast.success("Offerta salvata")
                      this.offers[sku]["marketplaces"][marketId]["offer"]=res.data
                  }).catch((error)=>{
                      this.toast.error(error.response.detail)
                  })

            }
          },

          async saveMassive(){
            let messages=""
            let errors=""
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                for(let [marketId,value] of Object.entries(obj)){
                    if(value){
                        console.log("OK")
                        let offer=this.offers[sku]["marketplaces"][marketId]["offer"]
                        offer["product"]=this.offers[sku]["marketplaces"][marketId].product
                        offer["marketplace"]=marketId
                        offer["company"]=this.company.id
                        console.log(offer)
                        if(offer["price"]==null || offer["price"]=="" || offer["price"]==undefined){
                            errors=errors+String(sku)+" - Devi inserire il prezzo\n"
                            continue
                        }
                        if(offer["iva"]==null || offer["iva"]=="" || offer["iva"]==undefined){
                            errors=errors+String(sku)+" - Devi inserire l'IVA\n"
                            continue
                        }
                        if(offer.id==null || offer.id==undefined){
                            let res = await this.axios.post("/api/offers/"+this.productType+"/?company="+this.company.id,offer).then((res) => {
                                messages=messages+String(sku)+" - Offerta creata\n"
                                this.offers[sku]["marketplaces"][marketId]["offer"]=res.data
                                
                            }).catch((error)=>{
                                errors=errors+String(sku)+" - "+error.response.detail+"\n"
                            })
                        }
                        else{
                            let res1 = await this.axios.put("/api/offers/"+this.productType+"/"+offer.id+"/?company="+this.company.id,offer).then((res) => {
                                messages=messages+String(sku)+" - Offerta salvata\n"
                                this.offers[sku]["marketplaces"][marketId]["offer"]=res.data
                            }).catch((error)=>{
                                errors=errors+String(sku)+" - "+error.response.detail+"\n"
                            })

                        }
                    }
                }
            }
            if(messages){
                this.toast.success(messages)
            }
            if(errors){
                this.toast.error(errors)
            }
          },
          
          checkbox(id,event){
              this.checkboxSelected[id]=event.target.checked;
              if(event.target.checked==false){
                  delete(this.checkboxSelected[id])
              }
          },
  
          selectAllOffers(value){
            //   for(var i=0; i<this.offers.length;i++){
            //     this.checkboxSelected[this.products[i].id]=value;
            //   }
          },
          deSelectAllOffers(){
            //   for(var key of Object.keys(this.checkboxSelected)){
            //       delete(this.checkboxSelected[key])
            //   }
          },
          
          
  
          
          changeCompany(key){
               
              window.location.href='/offers/?company='+this.companies[key].id;
               
          },
          
           async doAction(){
              var id_list=[]
              for(var [id,value] of Object.entries(this.checkboxSelected)){
                  if(value==true){
                      id_list.push(parseInt(id))
                  }
              }
              if(this.actionToDo=="save"){
                  var success=[]
                  var errors=[]
                  
                  for(var [key,item] of Object.entries(this.items)){
                      if(id_list.includes(item.id)){
                          var data={}
                          data["sku"]=product.sku
                          data["gtin"]=product.gtin
                          data["gtin_type"]=product.gtin_type
                          
                          
                          
                          
                          
                          
                      }
                  }
                  if(success.length>0){
                      var messageS=""
                      for(var i=0;i<success.length;i++){
                          messageS+=success[i]+"\n"
                      }
                      this.toast.success(messageS)
                  }
                  if(errors.length>0){
                      var messageE=""
                      for(var i=0;i<errors.length;i++){
                          messageE+=errors[i]+"\n"
                      }
                      this.toast.error(messageE)
                  }
              }
              else if(this.actionToDo=="disable"){
                  for(var i=0;i<id_list.length;i++){
                      
  
                  }
                  this.checkboxSelected={}
                  this.getProducts()
              }
          },

        setEnableIsActive(){
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                this.offers[sku]['marketplaces'][marketid]["offer"].is_active=this.enableIsActive
                            }
                        }
                    }
                  }
        },

        setNewPrice(){
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(this.newPrice>this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=this.newPrice
                                }
                                if(this.newPriceMin<this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=this.newPrice
                                }
                                this.offers[sku]['marketplaces'][marketid]["offer"].price=this.newPrice
                            }
                        }
                    }
                  }
            
        },

        setAddNewPricePercent(){
            if(!this.addNewPricePercent){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=0
                                }
                                let price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].price)+parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].price)*parseFloat(this.addNewPricePercent)/100
                                this.offers[sku]['marketplaces'][marketid]["offer"].price=price
                                if(price>this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=price
                                }
                                if(price<this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=price
                                }
                            }
                        }
                    }
                  }
        },
        setAddNewPriceEuro(){
            if(!this.addNewPriceEuro){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=0
                                }
                                let price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].price)+parseFloat(this.addNewPriceEuro)
                                this.offers[sku]['marketplaces'][marketid]["offer"].price=price
                                if(price>this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=price
                                }
                                if(price<this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=price
                                }
                            }
                        }
                    }
                  }
        },



        setNewIVA(){
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                this.offers[sku]['marketplaces'][marketid]['offer'].iva=this.newIVA
                            }
                        }
                    }
                }
        },





        setEnableMinMax(){
           
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(this.offers[sku]['marketplaces'][marketid]["offer"].min_price && this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].is_min_max=this.enableMinMax
                                }
                                else{
                                    this.offers[sku]['marketplaces'][marketid]["offer"].is_min_max=false
                                }
                            }
                        }
                    }
                  }
        },
        setNewPriceMin(){
            if(!this.newPriceMin){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(this.newPriceMin>this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=this.newPriceMin
                                }
                                if(this.newPriceMin>this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=this.newPriceMin
                                }
                                this.offers[sku]['marketplaces'][marketid]["offer"].min_price=this.newPriceMin
                            }
                        }
                    }
                  }
        },
        setNewPriceMax(){
            if(!this.newPriceMax){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(this.newPriceMax<this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=this.newPriceMax
                                }
                                if(this.newPriceMax<this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=this.newPriceMax
                                }
                                this.offers[sku]['marketplaces'][marketid]["offer"].max_price=this.newPriceMax
                            }
                        }
                    }
                  }
        },
        setAddPriceMinEuro(){
            if(!this.addPriceMinEuro){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=0
                                }
                                let price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].min_price)+parseFloat(this.addPriceMinEuro)
                                this.offers[sku]['marketplaces'][marketid]["offer"].min_price=price
                                if(price<this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=price
                                }
                                if(this.price>this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=price
                                }

                            }
                        }
                    }
                  }
        },
        setAddPriceMaxEuro(){
            if(!this.addPriceMaxEuro){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=0
                                }
                                let price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].max_price)+parseFloat(this.addPriceMaxEuro)
                                this.offers[sku]['marketplaces'][marketid]["offer"].max_price=price
                                if(price>this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=price
                                }
                                if(this.price<this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=price
                                }
                            }
                        }
                    }
                  }
        },
        setAddPriceMinPercent(){
            if(!this.addPriceMinPercent){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=0
                                }
                                let price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].min_price)+parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].min_price)*parseFloat(this.addPriceMinPercent)/100
                                this.offers[sku]['marketplaces'][marketid]["offer"].min_price=price
                                if(price<this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=price
                                }
                                if(this.price>this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=price
                                }
                            }
                        }
                    }
                  }
        },
        setAddPriceMaxPercent(){
            if(!this.addPriceMaxPercent){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].max_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].max_price=0
                                }
                                let price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].max_price)+parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].max_price)*parseFloat(this.addPriceMaxPercent)/100
                                this.offers[sku]['marketplaces'][marketid]["offer"].max_price=price
                                if(price>this.offers[sku]['marketplaces'][marketid]["offer"].price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].price=price
                                }
                                if(this.price<this.offers[sku]['marketplaces'][marketid]["offer"].min_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].min_price=price
                                }
                            }
                        }
                    }
                  }
        },
        setEnableOffer(){
            
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(this.offers[sku]['marketplaces'][marketid]["offer"].offer_price && this.offers[sku]['marketplaces'][marketid]["offer"].start_offer && this.offers[sku]['marketplaces'][marketid]["offer"].end_offer){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].offer_is_active=this.enableOffer
                                }
                                else{
                                    this.offers[sku]['marketplaces'][marketid]["offer"].offer_is_active=false
                                }
                            }
                        }
                    }
                  }
        },
        setStartDateOffer(){
            if(!this.startDateOffer){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                this.offers[sku]['marketplaces'][marketid]["offer"].start_offer=this.startDateOffer
                            }
                        }
                    }
                  }
        },
        setEndDateOffer(){
            if(!this.endDateOffer){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                this.offers[sku]['marketplaces'][marketid]["offer"].end_offer=this.endDateOffer
                            }
                        }
                    }
                  }
        },
        setNewPriceOffer(){
            if(!this.newPriceOffer){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                this.offers[sku]['marketplaces'][marketid]["offer"].offer_price=this.newPriceOffer
                            }
                        }
                    }
                  }
        },
        setAddPriceOfferEuro(){
            if(!this.addPriceOfferEuro){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].offer_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].offer_price=0
                                }
                                this.offers[sku]['marketplaces'][marketid]["offer"].offer_price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].offer_price)+parseFloat(this.addPriceOfferEuro)
                            }
                        }
                    }
                  }
        },
        setAddPriceOfferPercent(){
            if(!this.addPriceOfferPercent){
                this.toast.error("Devi inserire un valore!")
                return 
            }
            for(let [sku,obj] of Object.entries(this.checkboxSelected)){
                    for(let [marketid,value] of Object.entries(obj)){
                        if(value){
                            if(this.offers[sku]['marketplaces'][marketid]['item']!=null){
                                if(!this.offers[sku]['marketplaces'][marketid]["offer"].offer_price){
                                    this.offers[sku]['marketplaces'][marketid]["offer"].offer_price=0
                                }
                                this.offers[sku]['marketplaces'][marketid]["offer"].offer_price=parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].offer_price)+parseFloat(this.offers[sku]['marketplaces'][marketid]["offer"].offer_price)*parseFloat(this.addPriceOfferPercent)/100
                            }
                        }
                    }
                  }
        },




  
      },
      components:{Sidebar,HeaderNav,Footer}
  
  
      
  
  }
  </script>
  <style scoped>
  
  .hwfix{
      width:660px;
  }
  .hwfixsmall{
      width:150px;
  }
  .bi{
    font-size:1.5rem;
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
  </style>