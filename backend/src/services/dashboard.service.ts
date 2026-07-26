import prisma from "../config/prisma";
import { generateQueue } from "../queue/generate.queue";

export class DashboardService {

    static async getStats() {
    
    const today = new Date();

    today.setHours(0,0,0,0);

        const [

            users,

            assets,

            favorites,

            pending,

            completed,

	    failed,

	    todayGenerate,

            providers,

            queue

        ] = await Promise.all([

            prisma.user.count(),

            prisma.asset.count(),

            prisma.asset.count({
                where: {
                    favorite: true
                }
            }),

            prisma.asset.count({
                where: {
                    status: "pending"
                }
            }),

            prisma.asset.count({
                where: {
                    status: "completed"
                }
            }),

	    prisma.asset.count({
  		where: {
      		    status: "failed"
  		}
            }),

	    prisma.asset.count({
           	where: {
              	    createdAt: {
                        gte: today
                    }
                }
	    }),

            prisma.asset.groupBy({

   		by: ["provider"],

   		where: {

       		    provider: {

          		not: "pending"

       		    }

   		},

   		_count: true

        	       		
            }),

            generateQueue.getJobCounts()

        ]);
	
	const providerStats = providers.map(provider => ({

   	    provider: provider.provider,

  	    total: provider._count

	}));

        return {

   	    users,

   	    assets,

   	    favorites,

   	    pending,

   	    completed,

   	    failed,

   	    todayGenerate,

   	    providers: providerStats,

   	    queue

        };

    }

}