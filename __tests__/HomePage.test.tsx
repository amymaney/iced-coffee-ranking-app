import {render, screen, fireEvent} from "@testing-library/react";
import Page from "@/app/page";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

global.fetch = jest.fn(()=>
    Promise.resolve({
        json:() => Promise.resolve([
            {
                id:1,
                name: "Coffee House",
                location: "London",
                rating: 4.5,
                icedCoffees: [],
            },
        ]),
    })
) as jest.Mock;

describe("Homepage", () => {
    it("renders the homepage title", () => {
      render(
        <SessionProvider session={null}>
          <Page />
        </SessionProvider>
      );
      const pageTitle = document.querySelector("#page-title");
      expect(pageTitle).toBeInTheDocument();
    });
  
    it("shows the sign-in button when not logged in", () => {
      render(
        <SessionProvider session={null}>
          <Page />
        </SessionProvider>
      );
  
      const signInButton = document.querySelector("#sign-in-button");
      expect(signInButton).toBeInTheDocument();
    });
  });