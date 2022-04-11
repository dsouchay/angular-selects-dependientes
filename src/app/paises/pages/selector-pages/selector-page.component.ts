import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import {  PaisSmall } from '../../interfaces/paises.interfaces';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario:FormGroup = this.fb.group({
    region:['',Validators.required],
    pais:['',Validators.required],
    frontera:['',Validators.required],
  });

  //LlenarSelectores
  regiones:string[]=[];
  paises: PaisSmall[]=[];
  fronteras: PaisSmall[]=[];
  cargando : boolean = false;

  constructor( private fb:FormBuilder,
               private paiseServices:PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paiseServices.regiones;

    //Cdo cambie la region
    // this.miFormulario.get('region')?.valueChanges
    // .subscribe( region =>{
    //   this.paiseServices.getPaisesPorRegion(region)
    //   .subscribe(paises=>{
    //     this.paises=paises;
    //    /* paises.forEach((element:Country) => {
    //       this.paises[<any>element.cca3] = element.name.common;
    //       console.log(element.name.common,element.cca3);
    //     });*/
    //   })
    // });

     //cdo cambia la region
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_)=>{
        (this.miFormulario.get('pais')?.value?this.miFormulario.get('pais')?.reset(''):false);
        this.paises=[];
        this.cargando = true;
      }),
      switchMap( region => this.paiseServices.getPaisesPorRegion(region))
    )
    .subscribe( paises =>{
      this.paises = paises;
      this.cargando = false;

    });

    //cdo cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap((_)=>{
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap( codPais => this.paiseServices.getPaisPorCodigo(codPais))
    )
    .subscribe( pais => {
      this.cargando = false;
      if (!pais || !pais[0]?.borders)
        this.fronteras = [];
      else {
        let codes = pais[0].borders.join(',');
        this.paiseServices.getPaisPorCodigoSmall(codes).subscribe(( borders)=>{
          if (!borders)  this.fronteras = [];
          else this.fronteras = borders;
        });
        }
    });


  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
