import cropGif from "../assets/image/crop.gif"
import fertGif from "../assets/image/fert.gif"
import cropYieldGif from "../assets/image/crop_yield.gif";
import cropMarketTrendGif from "../assets/image/crop_market_trend.gif";

const CardData = [
    {
      title: "featuresCard.title1",
      description:"featuresCard.description1",
      image: cropGif,
      path:"/soil-recommandation"

    },
    {
      title: "featuresCard.title2",
      description:"featuresCard.description2",
      image:fertGif,
      path: "/fertilizerRecommendation"
  
    },
    {
      title: "featuresCard.title3",
      description:"featuresCard.description3",
      image:cropYieldGif,
      path: "/cropYieldPredictor"
  
    },
    {
      title: "featuresCard.title4",
      description:"featuresCard.description4",
      image:cropMarketTrendGif,
      path: "/cropMarketTrendAnalyzer"
  
    },
  
  ]

export default CardData;