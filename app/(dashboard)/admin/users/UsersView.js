"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Check,
  UserCircle,
  Pencil,
  Mail,
  CircleX,
  SlidersHorizontal,
} from "lucide-react";
import PageIntro from "@/components/PageIntro";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/primitives";
import {
  DIRECTORY_STUDENTS,
  DIRECTORY_ADMINS,
  DIRECTORY_STATUS_TONE,
} from "@/lib/sample-data";
import S, { HIDE_SECONDARY, HIDE_ID } from "./UsersView.style";

const ROWS_PER_PAGE = 8;

// "All" is the sentinel for "no status filter"; every other entry
// matches a `status` value on the records directly.
const FILTERS = {
  students: ["All", "Active", "Inactive", "Graduated", "Withdrawn"],
  administrators: ["All", "Active", "Inactive"],
};

const TABS = [
  { id: "students", label: "Students", rows: DIRECTORY_STUDENTS },
  { id: "administrators", label: "Administrators", rows: DIRECTORY_ADMINS },
];

function initials(name) {
  const [first, second] = name.split(" ");
  return (first[0] + (second ? second[0] : "")).toUpperCase();
}

function matches(user, query) {
  if (!query) return true;
  const haystack =
    `${user.name} ${user.email} ${user.code} ${user.primary}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function UsersView() {
  const [tab, setTab] = useState("students");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({});
  // { id, top, left } -- coordinates are measured from the trigger
  // because the menu is position: fixed (see UsersView.style.js).
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);

  const isStudents = tab === "students";
  const source = isStudents ? DIRECTORY_STUDENTS : DIRECTORY_ADMINS;

  const visible = useMemo(
    () =>
      source.filter(
        (u) => matches(u, query) && (filter === "All" || u.status === filter),
      ),
    [source, query, filter],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / ROWS_PER_PAGE));
  // Clamped rather than stored: filtering down to fewer pages while
  // sitting on a high page would otherwise render an empty table.
  const currentPage = Math.min(page, pageCount);
  const rows = visible.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);
  const allOnPageSelected = rows.length > 0 && rows.every((u) => selected[u.id]);

  // Dismiss on outside click or Escape, and on scroll/resize since
  // either invalidates the measured position the fixed menu is pinned to.
  useEffect(() => {
    if (!menu) return undefined;

    function onPointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setMenu(null);
    }
    const close = () => setMenu(null);

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [menu]);

  function switchTab(next) {
    setTab(next);
    setFilter("All");
    setPage(1);
    setSelected({});
    setMenu(null);
  }

  function toggleRow(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = { ...prev };
      rows.forEach((u) => {
        next[u.id] = !allOnPageSelected;
      });
      return next;
    });
  }

  function openMenu(e, id) {
    if (menu?.id === id) {
      setMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const MENU_HEIGHT = 190;
    const MENU_WIDTH = 210;
    // Flip above the trigger when there isn't room below it.
    const top =
      rect.bottom + 6 + MENU_HEIGHT > window.innerHeight
        ? Math.max(8, rect.top - 6 - MENU_HEIGHT)
        : rect.bottom + 6;
    const left = Math.max(
      8,
      Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8),
    );
    setMenu({ id, top, left });
  }

  return (
    <S.Page>
      <S.HeadRow>
        <PageIntro
          eyebrow="Institution directory"
          heading="Users"
          sub={`${DIRECTORY_STUDENTS.length} students and ${DIRECTORY_ADMINS.length} administrators across the institution.`}
        />
        <S.HeadActions>
          {/* Stays until GET /api/v1/users is wired up -- see
              lib/sample-data.js. Every name below is fabricated. */}
          <Badge $tone="neutral">Sample</Badge>
          <Button variant="secondary" type="button">
            Export CSV
          </Button>
          <Button variant="primary" type="button">
            {isStudents ? "Add student" : "Add administrator"}
          </Button>
        </S.HeadActions>
      </S.HeadRow>

      <S.Tabs role="tablist" aria-label="Directory">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <S.Tab
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              $active={active}
              onClick={() => switchTab(t.id)}
            >
              <span>{t.label}</span>
              <S.TabCount $active={active}>{t.rows.length}</S.TabCount>
            </S.Tab>
          );
        })}
      </S.Tabs>

      <S.Panel>
        <S.Toolbar>
          {selectedIds.length > 0 ? (
            <S.BulkBar>
              <S.BulkLabel>{selectedIds.length} selected</S.BulkLabel>
              <S.FilterRow>
                <S.BulkAction type="button">Send message</S.BulkAction>
                <S.BulkAction type="button">Change status</S.BulkAction>
                <S.BulkAction type="button" $danger>
                  Deactivate
                </S.BulkAction>
              </S.FilterRow>
              <S.LinkAction type="button" onClick={() => setSelected({})}>
                Clear
              </S.LinkAction>
            </S.BulkBar>
          ) : (
            <>
              <S.Search>
                <Search size={16} aria-hidden="true" />
                <S.SearchInput
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, ID, or email"
                  aria-label="Search the directory"
                />
              </S.Search>

              <S.FilterRow>
                {FILTERS[tab].map((f) => (
                  <S.Filter
                    key={f}
                    type="button"
                    $active={filter === f}
                    aria-pressed={filter === f}
                    onClick={() => {
                      setFilter(f);
                      setPage(1);
                    }}
                  >
                    {f === "All" ? `All ${tab}` : f}
                  </S.Filter>
                ))}
              </S.FilterRow>

              <S.ResultCount>
                {visible.length} {visible.length === 1 ? "result" : "results"}
              </S.ResultCount>
            </>
          )}
        </S.Toolbar>

        {visible.length === 0 ? (
          <S.Empty>
            <S.EmptyTitle>No users match this search</S.EmptyTitle>
            <S.EmptyBody>
              Check the spelling, or clear the filter to see everyone.
            </S.EmptyBody>
          </S.Empty>
        ) : (
          <S.TableScroll>
            <S.Table>
              <thead>
                <tr>
                  <S.Th scope="col">
                    <S.Check
                      type="button"
                      $on={allOnPageSelected}
                      onClick={toggleAllOnPage}
                      aria-label={
                        allOnPageSelected
                          ? "Deselect all rows on this page"
                          : "Select all rows on this page"
                      }
                    >
                      {allOnPageSelected && (
                        <Check size={11} strokeWidth={3.4} color="#FFFFFF" />
                      )}
                    </S.Check>
                  </S.Th>
                  <S.Th scope="col">Name</S.Th>
                  <S.Th scope="col" $hide={HIDE_ID}>
                    {isStudents ? "Student ID" : "Staff ID"}
                  </S.Th>
                  <S.Th scope="col">{isStudents ? "Program" : "Role"}</S.Th>
                  <S.Th scope="col" $hide={HIDE_SECONDARY}>
                    {isStudents ? "Term" : "Access"}
                  </S.Th>
                  <S.Th scope="col">Status</S.Th>
                  <S.Th scope="col">
                    <SlidersHorizontal size={14} aria-label="Row actions" />
                  </S.Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => {
                  const on = !!selected[u.id];
                  return (
                    <S.Row key={u.id}>
                      <S.CheckCell>
                        <S.Check
                          type="button"
                          $on={on}
                          onClick={() => toggleRow(u.id)}
                          aria-label={`${on ? "Deselect" : "Select"} ${u.name}`}
                        >
                          {on && (
                            <Check
                              size={11}
                              strokeWidth={3.4}
                              color="#FFFFFF"
                            />
                          )}
                        </S.Check>
                      </S.CheckCell>

                      <S.Td>
                        <S.Person>
                          <S.Avatar aria-hidden="true">
                            {initials(u.name)}
                          </S.Avatar>
                          <S.PersonText>
                            <S.Name>{u.name}</S.Name>
                            <S.Email>{u.email}</S.Email>
                          </S.PersonText>
                        </S.Person>
                      </S.Td>

                      <S.Td $hide={HIDE_ID}>
                        <S.Mono>{u.code}</S.Mono>
                      </S.Td>

                      <S.Td>
                        <S.Primary>{u.primary}</S.Primary>
                        <S.PrimaryMeta>{u.primaryMeta}</S.PrimaryMeta>
                      </S.Td>

                      <S.Td $hide={HIDE_SECONDARY}>
                        <S.Secondary>{u.secondary}</S.Secondary>
                      </S.Td>

                      <S.Td>
                        <Badge $tone={DIRECTORY_STATUS_TONE[u.status]}>
                          {u.status}
                        </Badge>
                      </S.Td>

                      <S.MenuCell>
                        <S.Kebab
                          type="button"
                          $open={menu?.id === u.id}
                          onClick={(e) => openMenu(e, u.id)}
                          aria-label={`Actions for ${u.name}`}
                          aria-expanded={menu?.id === u.id}
                        >
                          <MoreVertical size={15} aria-hidden="true" />
                        </S.Kebab>
                      </S.MenuCell>
                    </S.Row>
                  );
                })}
              </tbody>
            </S.Table>
          </S.TableScroll>
        )}

        {visible.length > 0 && (
          <S.Pagination>
            <S.Range>
              Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}&ndash;
              {Math.min(currentPage * ROWS_PER_PAGE, visible.length)} of{" "}
              {visible.length}
            </S.Range>
            <S.Pager>
              <S.PageBtn
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} aria-hidden="true" />
              </S.PageBtn>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <S.PageBtn
                  key={n}
                  type="button"
                  $active={n === currentPage}
                  aria-current={n === currentPage ? "page" : undefined}
                  onClick={() => setPage(n)}
                >
                  {n}
                </S.PageBtn>
              ))}
              <S.PageBtn
                type="button"
                onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
                aria-label="Next page"
              >
                <ChevronRight size={15} aria-hidden="true" />
              </S.PageBtn>
            </S.Pager>
          </S.Pagination>
        )}
      </S.Panel>

      {menu && (
        <S.Menu
          ref={menuRef}
          role="menu"
          style={{ top: menu.top, left: menu.left }}
        >
          <S.MenuItem type="button" role="menuitem">
            <UserCircle size={16} aria-hidden="true" />
            <span>View profile</span>
          </S.MenuItem>
          <S.MenuItem type="button" role="menuitem">
            <Pencil size={16} aria-hidden="true" />
            <span>{isStudents ? "Edit enrollment" : "Edit permissions"}</span>
          </S.MenuItem>
          <S.MenuItem type="button" role="menuitem">
            <Mail size={16} aria-hidden="true" />
            <span>Send message</span>
          </S.MenuItem>
          <S.MenuDivider />
          <S.MenuItem type="button" role="menuitem" $danger>
            <CircleX size={16} aria-hidden="true" />
            <span>Deactivate</span>
          </S.MenuItem>
        </S.Menu>
      )}
    </S.Page>
  );
}
