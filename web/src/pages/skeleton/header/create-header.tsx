import * as React from 'react';
import { observer } from 'mobx-react';
import { Header } from './header';
import { GlobalHeaderStore } from './header-presenter';
import headerStyles from './header.css';

const THRESHOLD = 0.9;

export function createHeader() {
  const presenter = new GlobalHeaderStore();
  const intersectionObserver = new IntersectionObserver(
    entries => {
      presenter.setShowShortBarTitle(entries[0].intersectionRatio < THRESHOLD);
    },
    {
      // TODO Fix types
      rootMargin: `-${(headerStyles as any).shortHeaderHeight}`,
      threshold: THRESHOLD,
    },
  );
  const onCloseClicked = () => undefined;
  const titleRef = React.createRef<HTMLDivElement>();
  const GlobalHeader = () => {
    React.useEffect(() => {
      if (titleRef.current == null) {
        throw new Error('ref to title should not be null');
      }
      intersectionObserver.observe(titleRef.current);
    }, []);
    return (
      <Header
        showShortBarTitle={presenter.showShortBarTitle}
        onCloseClicked={onCloseClicked}
        titleRef={titleRef}
      />
    );
  };
  return observer(GlobalHeader);
}