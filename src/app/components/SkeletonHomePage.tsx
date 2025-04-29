import SkeletonCoffeeShopCard from "./SkeletonCoffeeShopCard";
import SkeletonMap from "./SkeletonMap";

export default function SkeletonHomePage() {
  return (
    <div>
      {/* header skeleton */}
      <div className="bg-[#fffcf4] px-6 py-4 h-18"></div>

      <div className="bg-[#f7edda] min-h-screen flex flex-col items-center pt-3">

      <div className="h-3"></div>
        {/* <div className="hidden sm:block mr-8 self-end h-5 bg-gray-300 w-40"></div> */}

        {/* title and subtitle */}
        <div className="mb-8">
          <h1 className="text-[#6F4E37] text-center text-5xl font-roboto-mono pb-3 pt-2">the bean map</h1>
          <h2 className="text-[#6F4E37] text-lg lg:text-xl">for londoners who like their coffee on the rocks.</h2>
        </div>


        <div className="flex flex-col lg:flex-row justify-between w-full px-4 lg:px-20 gap-3 lg:gap-8">

          <div className="w-full lg:w-3/5">
            <h3 className="text-[#6F4E37] text-lg lg:text-xl text-center lg:text-left">top coffee shops</h3>

            {/* coffee shop cards */}
            <div className="lg:space-y-6 space-y-4 mt-4 lg:mb-10">
              <SkeletonCoffeeShopCard />
              <SkeletonCoffeeShopCard />
              <SkeletonCoffeeShopCard />
              <SkeletonCoffeeShopCard />
            </div>
          </div>

          <div className="w-full lg:w-2/5 px-2 py-2 space-y-4 flex flex-col">
            <div className="w-full bg-[#FFFCF4] lg:py-5 px-6 py-4 rounded-3xl mb-5 h-40"></div>

            {/* map */}
            <SkeletonMap />
          </div>

          

        </div>

      </div>
    </div>
    // <div className="w-full bg-[#FFFCF4] shadow-md lg:py-5 px-6 py-4 rounded-4xl flex justify-between items-center animate-pulse">
    //   <div className="space-y-4">
    //     <div className="h-5 bg-gray-300 rounded w-2/3"></div>
    //     <div className="h-4 bg-gray-200 rounded w-3/4"></div> 
    //     <div className="h-3 bg-gray-200 rounded w-1/2"></div> 
    //   </div>
    //   <div className="space-y-2">
    //     <div className="h-8 bg-gray-200 rounded w-16"></div> 
    //   </div>
    // </div>
  );
  }
  