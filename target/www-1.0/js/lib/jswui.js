/**
 * The file defines the UI components which can be used in conjunction with the logic layer of the
 * JSW Toolkit.
 * 
 * Copyright <c> The University of Mancehster, 2010 - 2011.
 * @author Vit Stepanovs <vitaly.stepanov@gmail.com> 
 */

/** Namespace for all library objects. */
var jsw;

if (!jsw) {
    jsw = {};
}

jsw.ui = {};

/**
 * TableControl component allows to display data stored in the given array in a tabular form.
 * Each element of array is expected to be an object of the same structure. Property names are used
 * as column headers.
 * 
 * @param dataSet Data set to display as a table.
 * @param hostId ID of the HTML element to display the table in.
 * @param tableClass (optional) Name of the CSS class to use for the table generated.
 * @param noDataMsg (optional) Message to be displayed if the data set is empty.
 */
jsw.ui.TableControl = function (dataSet, hostId, tableClass, noDataMsg) {
    var host, html, rowCount;
    
    host = document.getElementById(hostId);
    
    if (!host) {
        throw 'The host element with ID "' + hostId + ' does not exist in the document!"';
    }

    if (!noDataMsg) {
        noDataMsg = 'The data set contains no results!';
    }

    rowCount = dataSet.length;

    if (rowCount > 0 || !noDataMsg) {
        html = '<table';
        
        if (tableClass) {
            html += ' class="' + tableClass + '"';
        }
        
        html += '><tr>';
        row = dataSet[0];

        for (column in row) {
            if (column && row.hasOwnProperty(column)) {
                html += '<th>' + column + '</th>';
            }
        }
                        
        html += '</tr>';

        for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            html += '<tr>';

            row = dataSet[rowIndex];
            for (column in row) {
                if (column && row.hasOwnProperty(column)) {
                    html += '<td>' + row[column] + '</td>';
                }
            }

            html += '</tr>';
        }

        html += '</table>';
    } else {
        html = noDataMsg;
    }

    document.getElementById(hostId).innerHTML = html;    
};

/**
 * Tab control objects allow to control visibility of panels ('tabs'), based on the user selection.
 * This is analogous to Windows tab control.
 *
 * @param tabs Array of objects representing each tab controlled.
 * @param classNames An object defining the CSS names for active/inactive, enabled/disabled tab
 * items.
 */
jsw.ui.TabControl = function (tabs, classNames) {
    var firstEnabled, tab, tabCount, tabIndex;

    /** Collection of objects representing each tab. */
    this.tabs = tabs;
    
    /**
     * An object with properties defining CSS class names for active/inactive, enabled/disabled tab
     * items
     */
    this.classNames = classNames;
   
    tabCount = tabs.length || 0;

    // Set tabs as enabled or disabled.
    for (tabIndex = 0; tabIndex < tabCount; tabIndex++) {
        tab = tabs[tabIndex];
      
        this.setOnClickHandler(this, tab.tabId);
      
        if (tab.enabled) {
            this.setEnabled(tab.tabId, true);
        } else {
            this.setEnabled(tab.tabId, false);
        }

        document.getElementById(tab.boxId).style.display = 'none';
    }

    // Select the first enabled tab.
    firstEnabled = this.findFirstEnabled();
   
    if (firstEnabled) {
        this.select(firstEnabled.tabId);
    }
}

/** Prototype for all TabControl objects. */
jsw.ui.TabControl.prototype = {
    /**
     * Returns an object representing the tab with the given id in the tabs collection.
     *
     * @param id ID of the tab object to find.
     * @returns Object representing the tab with the given id.
     */
    find: function (id) {
        var tabs = this.tabs,
            tabCount = tabs.length,
            tabIndex;
         
            for (tabIndex = 0; tabIndex < tabCount; tabIndex++) {
                if (tabs[tabIndex].tabId === id) {
                return tabs[tabIndex];
            }
            }
     
        return undefined;
    },
   
    /**
     * Sets the onclick handler for the tab item with the given ID.
     *
     * @param tabControl Reference to the parent tab control.
     * @param id ID of the tab item to set the onclick handler for.
     */
    setOnClickHandler: function (tabControl, id) {
        var existingHandler = document.getElementById(id).onclick; 
      
        document.getElementById(id).onclick = function () {         
            if (existingHandler) {
                existingHandler();
            }
         
                tabControl.select(id);
         
            return false;
        };
    },
    
    /**
     * Finds the first tab in the tab collection which is not disabled.
     *
     * @returns Object corresponding to the first tab in the collection which is not disabled.
     */
    findFirstEnabled: function () {
        var tab,
            tabs = this.tabs,
            tabCount = tabs.length,
            tabIndex;
      
        for (tabIndex = 0; tabIndex < tabCount; tabIndex++) {
            tab = tabs[tabIndex];
      
            if (tab.enabled) {
                return tab;
            }
        }
    },
   
    /**
     * Sets the enabled/disabled status of the tab with the given ID.
     *
     * @param id ID of the tab to set the status for.
     * @param enabled Boolean value indicating whether the tab should be enabled (true) or disabled
     * (false).
     */
    setEnabled: function (id, enabled) {
        var firstEnabled, tab;

        if (!this.classNames || (!enabled && !this.classNames.disabled)) {
            return;
        }
      
        tab = this.find(id);
      
        if (!tab) {
            // Can't select tab if it's not registered.
            return;
        }
      
        if (!enabled) {
                document.getElementById(tab.tabId).className = this.classNames.disabled;
         
            if (this.selected && this.selected.tabId === id) {
                document.getElementById(tab.boxId).style.display = "none";
            
                    firstEnabled = this.findFirstEnabled();
         
                if (firstEnabled) {
                    this.select(firstEnabled.tabId);
                }
            }
        } else {
            document.getElementById(tab.tabId).className = this.classNames.enabled || "";
        }
      
        tab.enabled = enabled;
    },
   
    /**
     * Selects the tab item with the given ID on the page and displays the corresponding content.
     *
     * @param id ID of the tab item to select.
     */
    select: function (id) {
        var tab;

        if (!this.classNames || !this.classNames.active) {
            return;
        }
      
        tab = this.find(id);
      
        if (!tab || !tab.enabled) {
            // Can't select tab if it's not present or is disabled.
            return;
        }

        if (this.selected) {
                // Deselect the currently selected tab.
            document.getElementById(this.selected.tabId).className = this.classNames.inactive || "";
            document.getElementById(this.selected.boxId).style.display = "none";
        }
         
            // Deselect the given tab.
            document.getElementById(tab.tabId).className = this.classNames.active;
            document.getElementById(tab.boxId).style.display = "block";
      
        this.selected = tab;
    }
};

/**
 * TreeControl component allows displaying a tree hierarchy on a page.
 *
 * @param hierarchy Array representing the hierarchy to show.
 * @param hostId ID of the HTML element to host the hierarchy.
 * @param options Object containing information how the nodes of the tree will be displayed. The
 * object can contain the following fields:
 *      - titleClass:         Name of the CSS class to use for displaying item titles.
 *      - childrenCountClass: Name of the CSS class to use for displaying the number of children of 
 *                            the class.
 *      - highlightClass:     Name of the CSS class to use for highlighting parts of names matched
 *                            during search.
 *      - specialClass:       Name of the CSS class to use for displaying 'special' nodes.
 */
jsw.ui.TreeControl = function (hierarchy, hostId, options) {
    var children, childrenCountClass, childrenElement, childCount, childIndex, element, elements,
        elementTitle, item, items, itemElement, names, nameCount, nameIndex, rootElement,
        specialClass, titleClass, titleElement;

    this.hierarchy = hierarchy;
    this.hostId = hostId;
    this.options = options;

    rootElement = document.createElement('span');

    elements = new jsw.util.Queue();
    items = new jsw.util.Queue();

    childCount = hierarchy.length;

    for (childIndex = 0; childIndex < childCount; childIndex++) {
        items.enqueue(hierarchy[childIndex]);
        elements.enqueue(rootElement);
    }

    if (options) {
        titleClass = options.titleClass;
        childrenCountClass = options.childrenCountClass;
        specialClass = titleClass + ' ' + options.specialClass;
    } else {
        titleClass = '';
        childrenCountClass = '';
        specialClass = '';
    }

    while (!items.isEmpty()) {
        item = items.dequeue();
        element = elements.dequeue();

        children = item.children;
        childCount = children.length;
        names = item.names;
        nameCount = names.length;
        elementTitle = '';

        for (nameIndex = 0; nameIndex < nameCount; nameIndex++) {
            elementTitle += names[nameIndex] + ', ';
        }
               
        itemElement = document.createElement('div');
        itemElement.style.display = 'block';
               
        titleElement = document.createElement('a');

        if (item.special && specialClass) {
            titleElement.setAttribute('class', specialClass);
        } else if (titleClass) {
            titleElement.setAttribute('class', titleClass);
        }

        titleElement.innerHTML = elementTitle.substring(0, elementTitle.length - 2);
        itemElement.appendChild(titleElement);        

        if (childCount > 0) {
            this.assignItemOnClick(itemElement);
            itemElement.appendChild(document.createTextNode(' ('));

            titleElement = document.createElement('span');

            if (childrenCountClass) {
                titleElement.setAttribute('class', childrenCountClass);
            }

            titleElement.innerHTML = childCount;
            itemElement.appendChild(titleElement);

            itemElement.appendChild(document.createTextNode(')'));

            childrenElement = document.createElement('div');
            childrenElement.style.display = 'none';
            childrenElement.style.marginLeft = '20px';
                                    
            for (childIndex = 0; childIndex < childCount; childIndex++) {
                items.enqueue(children[childIndex]);
                elements.enqueue(childrenElement);
            }

            itemElement.appendChild(childrenElement);
        }

        element.appendChild(itemElement);
    }

    this.showFirstLevel(rootElement);
    
    document.getElementById(hostId).appendChild(rootElement);
}

/** Prototype for all TreeControl objects. */
jsw.ui.TreeControl.prototype = {
    /**
     * Assigns an onClick handler to the HTML element representing an item in the hierarchy.
     * 
     * @param element Element to assign the onClick handler to.
     * @param childrenElementId ID of the element containing all children of the item.
     */
    assignItemOnClick: function (element) {
        element.firstChild.onclick = function () {
            var child, children, totalCount, visibleCount;

            children = element.lastChild;
            child = children.firstChild;
            totalCount = 0;
            visibleCount = 0;

            while (child !== null) {
                if (child.style.display !== 'none') {
                    visibleCount++;
                }

                child.style.display = 'block';
                child = child.nextSibling;
                totalCount++;
            }

            children.style.display =
                (visibleCount < totalCount || children.style.display === 'none') ? 'block' : 'none';
        };
    },

    /**
     * Shows all nodes with the names (partially) matching the given string.
     *
     * @param str Substring to search the node names for.
     */
    showMatches: function (str) {
        var children, childElement, element, elements, searchForExpr, hierarchy, highlightClass,
            hostElement, hostId, innerHtml, item, items, itemCount, itemIndex, names, nameCount,
            nameIndex, matchFound, parentElement, replaceExpr, rootElement;
        
        /** 
         * Function to be used in string.replace() method when trying to match node names against
         * the given string.
         * 
         * @param a
         * @param b Text matched.
         * @returns String to replace the matched text with.
         */
        function replaceFunc(a, b) {
            matchFound = true;
            return (replaceExpr) ? replaceExpr + b + '</span>' : b;
        }

        hierarchy = this.hierarchy;
        itemCount = hierarchy.length;
        hostId = this.hostId;
        hostElement = document.getElementById(hostId);
        rootElement = hostElement.removeChild(hostElement.firstChild);
        element = rootElement.firstChild;
        items = new jsw.util.Queue();
        elements = new jsw.util.Queue();

        for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
            items.enqueue(hierarchy[itemIndex]);
            elements.enqueue(element);
            element = element.nextSibling;
        }

        searchForExpr = new RegExp('(' + str + ')');
        highlightClass = (this.options) ? this.options.highlightClass : null;
        replaceExpr = (highlightClass) ? '<span class="' + highlightClass + '">' : '';

        while (!items.isEmpty()) {
            item = items.dequeue();
            element = elements.dequeue();

            children = item.children;
            itemCount = children.length;
        
            if (itemCount > 0) {
                childElement = element.lastChild.firstChild;
            
                for (itemIndex = 0; itemIndex < itemCount; itemIndex++) {
                    items.enqueue(children[itemIndex]);
                    elements.enqueue(childElement);
                    childElement = childElement.nextSibling;
                }
            }

            names = item.names;
            nameCount = names.length;
            matchFound = false;
            innerHtml = '';
    
            if (str === '') {
                for (nameIndex = 0; nameIndex < nameCount; nameIndex++) {
                    innerHtml += names[nameIndex] + ', ';
                }
            } else {
                for (nameIndex = 0; nameIndex < nameCount; nameIndex++) {
                    innerHtml += names[nameIndex].replace(searchForExpr, replaceFunc) + ', ';
                }
            }

            element.firstChild.innerHTML = innerHtml.substring(0, innerHtml.length - 2);

            if (str === '') {
                element.style.display = 'block';
                
                if (itemCount > 0) {
                    element.lastChild.style.display = 'none';
                }
            } else if (matchFound) {
                parentElement = element;

                do {
                    parentElement.style.display = 'block';

                    if (!parentElement.style.marginLeft) {
                        parentElement.lastChild.style.display = 'block';                        
                    }

                    parentElement = parentElement.parentNode;
                } while (parentElement.nodeName.toUpperCase() !== 'SPAN');
            } else {
                element.style.display = 'none';
            }
        }

        if (str === '') {
            this.showFirstLevel(rootElement);
        }

        hostElement.appendChild(rootElement);
    },

    /** 
     * Shows the first level of the tree as expanded.
     *
     * @param rootElement Element containing all the tree nodes.
     */
    showFirstLevel: function (rootElement) {
        var element, childrenElement;

        element = rootElement.firstChild;

        while (element !== null) {
            element.style.display = 'block';

            if (element.childNodes.length > 1) {
                childrenElement = element.lastChild;
                childrenElement.style.display = 'block';
            }

            element = element.nextSibling;
        }
    }
};