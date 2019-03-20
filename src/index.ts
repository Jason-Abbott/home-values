import fs from 'fs';
import path from 'path';
import house2223 from './2223.json';
import house2231 from './2231.json';
import house2234 from './2234.json';
import house2242 from './2242.json';
import house2246 from './2246.json';
import house2250 from './2250.json';
import house2257 from './2257.json';
import house2273 from './2273.json';
import house2279 from './2279.json';

const maxDate = new Date(2018, 12, 31);
const delimiter = ',';

interface EstimatePoint {
   /** Millisecond time stamp */
   x: number;
   /** Dollar value */
   y: number;
}

interface ZillowEstimate {
   points: EstimatePoint[];
   name: string;
}

interface ZillowChart {
   data: {
      property: {
         homeValueChartData: ZillowEstimate[];
      };
   };
}

// async function loadEstimates(address: string): Promise<ZillowEstimate> {
//    // https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=<ZWSID>&address=2xxx+s+white+pine+place&citystatezip=83706
//    return;
// }

/**
 * Create CSV with columns for each home.
 */
function main(...estimates: ZillowChart[]) {
   const months = new Map<string, Map<string, number>>();

   estimates.forEach(e => {
      const local = e.data.property.homeValueChartData[0];

      console.log(
         `Processing ${local.points.length} estimates for ${local.name}`
      );

      local.points.forEach(p => {
         const d = new Date(p.x);
         if (d > maxDate) {
            return;
         }

         const utc = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
         if (!months.has(utc)) {
            months.set(utc, new Map<string, number>());
         }
         const m = months.get(utc)!;
         m.set(local.name, p.y);
      });
   });

   if (months.size == 0) {
      console.error('No estimates were found');
      return;
   }

   const header: string[] = [''];
   const rows: string[] = [];
   let headersReady = false;

   months.forEach((homes, d) => {
      let i = 1;
      const column = [d];

      homes.forEach((estimate, name) => {
         if (!headersReady) {
            header.push(name);
         } else if (header[i] != name) {
            console.error(`Column mismatch: ${header[i]} != ${name}`);
         }
         column.push(estimate.toString());
         i++;
      });

      if (!headersReady) {
         rows.push(header.join(delimiter));
         headersReady = true;
      }
      rows.push(column.join(delimiter));
   });

   const csv = rows.join('\n');

   fs.writeFile(
      path.resolve(__dirname, '..', 'dist', 'estimates.csv'),
      csv,
      err => {
         if (err) {
            console.error(err);
         }
      }
   );
}

main(
   house2242,
   house2223,
   house2231,
   house2234,
   house2246,
   house2250,
   house2257,
   house2273,
   house2279
);
