import { Heading, Page } from "@shopify/polaris";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { useEffect, useReducer } from "react";

const SHOP_DATA = gql(`query {
  shop {
    name
    plan {
      displayName
    }
  }
}`);

const initialState = {
  shopName: "",
  shopPlan: ""
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SHOP_NAME":
      return { ...state, shopName: action.payload };
    case "SET_SHOP_PLAN":
      return { ...state, shopPlan: action.payload };
    default:
      throw new Error();
  }
}

export default function Index() {
  const { data } = useQuery(SHOP_DATA);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_SHOP_NAME", payload: data.shop.name });
      dispatch({ type: "SET_SHOP_PLAN", payload: data.shop.plan.displayName });
    }
  }, [data]);

  return (
    <Page>
      {console.log(state.shopName)}
      <Heading>Shopify app with Node and React 🎉</Heading>
      <Heading>If you can see info about your shop below, you're good to go! 😎</Heading>
      <br />
      <Heading>Store name: {state.shopName}</Heading>
      <br />
      <Heading>Store plan: {state.shopPlan}</Heading>
    </Page>
  )
};
