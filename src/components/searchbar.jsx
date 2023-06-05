import React from "react";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import "../App.css";
// Example items, to simulate fetching from another resources.
var items = [];
var items_map = new Map();
var last_clicked_element = null;
function check() {
  console.log("hui");
}

export async function getRepoCount(name) {
  items.find((o) => o.login === name).repo_count = await fetchRepoData(name);
}

async function fetchRepoData(name) {
  const response = await fetch(
    "https://api.github.com/users/" + name + "/repos"
  );
  const data = await response.json();

  return data.length;
}

function Items({ currentItems }) {
  const [visible, setVisible] = useState(true);
  function toggleVisibility(event, data) {
    last_clicked_element = event.target;
    setVisible(!visible);

    console.log(last_clicked_element);
  }
  return (
    <div className="items">
      {currentItems &&
        currentItems.map((item, i) => (
          <div
            onClick={() =>
              alert(
                "ID выбранного пользователя - " +
                  item.id +
                  "\nТип выбранного пользователя - " +
                  item.type +
                  "\nЯвляестся ли пользователь админом - " +
                  item.site_admin
              )
            }
          >
            <h3>{item.login}</h3>
          </div>
        ))}
    </div>
  );
}

export async function getUserRepoCount(name) {
  try {
    const response = await fetch(
      "https://api.github.com/users/" + name + "/repos",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log("result is: ", JSON.stringify(result, null, 4));
    items.find((o) => o.login === name).repo_count = result.length;

    console.log(result.length);
    return result.length;
  } catch (err) {
  } finally {
  }
}

function PaginatedItems({ itemsPerPage }) {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

function SearchBar() {
  let [value, setState] = useState(true);
  const reRender = () => {
    sort();
    console.log(items);
    setState(!value);
  };
  const [data, setData] = useState([]);
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  //https://api.github.com/users/tristoshestoi/repos
  const handleClick = async () => {
    setIsLoading(true);

    const uname = document.querySelector(".search").value;
    try {
      const response = await fetch(
        "https://api.github.com/search/users?q=" + uname,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(items);
      items = [];
      console.log(items);
      console.log("result is: ", JSON.stringify(result, null, 4));

      setData(result);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data);

  return (
    <div>
      <input
        type="search"
        id="query"
        name="q"
        className="search"
        placeholder="Search..."
      />
      <button onClick={handleClick}>Search</button>
      <button onClick={reRender}>Sort</button>
      {data != 0 &&
        !isLoading &&
        items.length === 0 &&
        /* {data.map((element) => {
        items.push(element.id);
      })} */

        data.items.forEach((element) => {
          if (!isLoading) {
            console.log(element);
            items.push(element);
          }
          getRepoCount(element.login);
        })}
      <PaginatedItems itemsPerPage={4}></PaginatedItems>
    </div>
  );
}

function useReRender() {
  sort();
  let [value, setState] = useState(true);
  setState(!value);
}

function sort() {
  items.sort((r1, r2) =>
    r1.repo_count > r2.repo_count ? 1 : r1.repo_count < r2.repo_count ? -1 : 0
  );
  console.log(items);
}

export default SearchBar;
