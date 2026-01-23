import React from "react";

const ReactMarkdown = ({ children, components = {} }) => {
  const content = typeof children === "string" ? children : "";
  const lines = content.split(/\r?\n/);
  const elements = [];
  let listItems = [];

  const Paragraph = components.p || "p";
  const UnorderedList = components.ul || "ul";
  const OrderedList = components.ol || "ol";
  const ListItem = components.li || "li";

  const flushList = (listType, key) => {
    if (listItems.length === 0) return;
    const ListComponent = listType === "ol" ? OrderedList : UnorderedList;
    elements.push(
      React.createElement(ListComponent, { key }, listItems.map((item, index) => (
        React.createElement(ListItem, { key: `li-${key}-${index}` }, item)
      ))),
    );
    listItems = [];
  };

  let currentListType = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const unorderedMatch = /^[-*]\s+(.+)/.exec(trimmed);
    const orderedMatch = /^(\d+)\.\s+(.+)/.exec(trimmed);

    if (unorderedMatch) {
      if (currentListType !== "ul") {
        flushList(currentListType, `list-${index}`);
        currentListType = "ul";
      }
      listItems.push(unorderedMatch[1]);
      return;
    }

    if (orderedMatch) {
      if (currentListType !== "ol") {
        flushList(currentListType, `list-${index}`);
        currentListType = "ol";
      }
      listItems.push(orderedMatch[2]);
      return;
    }

    if (trimmed === "") {
      flushList(currentListType, `list-${index}`);
      currentListType = null;
      return;
    }

    flushList(currentListType, `list-${index}`);
    currentListType = null;
    elements.push(
      React.createElement(Paragraph, { key: `p-${index}` }, trimmed),
    );
  });

  flushList(currentListType, "list-final");

  return React.createElement(React.Fragment, null, elements);
};

export default ReactMarkdown;
