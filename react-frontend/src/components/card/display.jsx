'use client';

import { useMemo, useState } from 'react';
import MtgCard from '@/components/card/mtgCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
export default function Display({
  cards,
  isLoading = false,
  filterType = undefined,
}) {
  const [sort, setSort] = useState('name');
  const [asc, setAsc] = useState(true);
  const [filter, setFilter] = useState(new Array());
  const displayCards = useMemo(() => {
    if (!cards) return [];
    let out = cards;
    for (const f of filter) {
      switch (f) {
        case 'mana':
          // filter only same mana here
          break;
        case 'type':
          out = out.filter((c) => {
            const lt = c.TypeLine.split(' — ');
            console.log(filterType.includes(lt[0]));
            return filterType.includes(lt[0]);
          });
          break;
      }
    }
    switch (sort) {
      case 'name':
        return asc
          ? out.sort((a, b) =>
              a?.Name?.localeCompare(b?.Name, undefined, {
                sensitivity: 'base',
              }),
            )
          : out.sort((a, b) =>
              b?.Name?.localeCompare(a?.Name, undefined, {
                sensitivity: 'base',
              }),
            );
      case 'cmc':
        return asc
          ? out.sort((a, b) => a?.CMC > b?.CMC)
          : out.sort((a, b) => a?.CMC < b?.CMC);
      default:
        return out;
    }
  }, [cards, asc, sort, filter]);
  const handleFilter = ({ newFilter, add = true }) => {
    if (!newFilter) return;

    if (add) {
      setFilter([...filter, newFilter]);
    } else {
      setFilter(filter.filter((item) => item !== newFilter));
    }
  };
  console.log(filter);
  return (
    <>
      <div
        className={`flex flex-row justify-evenly border rounded-2xl p-4 mb-2 gap-2 ${!displayCards?.length && !isLoading ? 'hidden' : ''}`}
      >
        <div className="flex flex-row gap-2">
          <div className="text-xl">Sort: </div>
          <Button onClick={() => setAsc((prev) => !prev)}>
            {asc ? 'ASC' : 'DSC'}
          </Button>
          <Button disabled={sort == 'name'} onClick={() => setSort('name')}>
            Name
          </Button>
          <Button disabled={sort == 'cmc'} onClick={() => setSort('cmc')}>
            CMC
          </Button>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-xl">Filter: </div>
          <Button
            className={`border hover:border-amber-500 ${filter.includes('mana') ? 'border-amber-500 bg-amber-200' : ''}`}
            onClick={() =>
              handleFilter({ newFilter: 'mana', add: !filter.includes('mana') })
            }
          >
            Same Mana
          </Button>
          {filterType ? (
            <Button
              className={`border hover:border-amber-500 ${filter.includes('type') ? 'border-amber-500 bg-amber-200' : ''}`}
              onClick={() =>
                handleFilter({
                  newFilter: 'type',
                  add: !filter.includes('type'),
                })
              }
            >
              Same Type
            </Button>
          ) : null}
        </div>
      </div>
      <ScrollArea className="border rounded-2xl bg-light w-full">
        <div
          className={`flex flex-wrap flex-row justify-center items-center max-h-[700px]`}
        >
          {isLoading ? (
            <div className="flex-col">
              <MtgCard isLoading={true} />
            </div>
          ) : null}

          {!!displayCards ? (
            displayCards?.map((c) => {
              return (
                <div key={c.ID || c.Name} className="flex-col">
                  <MtgCard data={c} />
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
