import { DatePipe } from "@angular/common";
import { Filtro } from "./Funcoes";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { right } from "@popperjs/core";

export class FuncoesRelatorio{

    static getConteudo(data: string, usuario: string , titulo1: string, titulo2: string, titulo3: string, titulo4: string) {
    
        return  {
        pageMargins: [ 15, 100, 15, 60 ],
        header: function(currentPage, pageCount, pageSize) {
            //if (currentPage <= 1) {
            //    return [];
            //}
            
            return [
                { 
	                table: {
                        headerRows: 1,
                        widths: [80, '*', 50],
                        body: [
                            [
                                {
                                    image: FuncoesRelatorio.logoBase64,
                                    width: 50,
                                    opacity: 0.5
                                }
                                ,
                                {
                                    stack: [
                                        {text: titulo1, fontSize: 15},
                                        {text: titulo2, fontSize: 10},
                                        {text: titulo3, fontSize: 10},
                                        {text: titulo4, fontSize: 10},                                        
                                    ]
                                },
                                { text: `Page ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 8 },
                            ],
                        ]
                    },
                    margin: [15, 10, 15, 10],
                    layout: 'headerLineOnly'
                        
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {width: '*', text: '', alignment: 'right', 	fillColor: '#eeeeee',fontSize: 14, bold: true,}
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }
          
            ];
        },
        footer: [
            
            {
                columns: [
                  { text: '  \n \n', fontSize: 8, alignment: 'left' },
                ]
            },
    
            {
                style: 'tableExample',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {width: '*', text: '', alignment: 'right', 	fillColor: '#eeeeee',fontSize: 14, bold: true,}
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {
            columns: [
              { text: 'Emitido em : ' + data  + '\n Gerado por : ' + usuario, fontSize: 6, alignment: 'left', margin: [15, 5, 0, 0] },
              { text: 'ClubWeb - TECNOSYS Consultoria', fontSize: 6, alignment: 'right', 	margin: [0, 5, 15, 0] }
            ]
            }
        ],
        content: [],
            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    fillColor: '#bcbebf'
                },
                headerEsquerda: {
                    fontSize: 12,
                    bold: true,
                    fillColor: '#bcbebf',
                    alignment: 'right'                
                },
                coluna: {
                    fontSize: 10
                },
                colunaZebra: {
                    fontSize: 10,
                    fillColor: '#d3d6d8'
                },
                colunaEsquerda: {
                    fontSize: 10,
                    alignment: 'right'
                },
                colunaZebraEsquerda: {
                    fontSize: 10,
                    fillColor: '#d3d6d8',
                    alignment: 'right'                
                }
            }
        };
    }


    static logoBase64 = 'data:image/jpeg;base64,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';

}

export class Linha{
    columns: Coluna[] = [];
}

export class Coluna{
    
}