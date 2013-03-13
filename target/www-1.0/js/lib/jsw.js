/**
 * it includes the following features:
 *
 * OWL/XML parser/writer.
 * BrandT - an OWL-EL reasoner (with limitations)
 * SPARQL parser (with limitations).
 * 
 * Copyright <c> The University of Mancehster, 2010 - 2011.
 * @author Vit Stepanovs <vitaly.stepanov@gmail.com>
 */

/** Namespace for all library objects. */
var jsw;

if (!jsw) {
    jsw = {};
}

// ============================== RDF namespace ===============================
jsw.rdf = {};

/** Defines IRIs of important concepts in RDF namespace. */
jsw.rdf.IRIs = {
    /** IRI by which the type concept is referred to in RDF. */
    TYPE: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
};

/** Represents a query to the RDF data. */
jsw.rdf.Query = function () {
    /** IRI to serve as a base of all IRI references in the query. */
    this.baseIri = null;
    /** Indicates that all non-unique matches should be eliminated from the results. */
    this.distinctResults = false;
    /** Number of results the query should return. */
    this.limit = 0;
    /** The number of a record to start returning results from. */
    this.offset = 0;
    /** Array of values to sort the query results by. */
    this.orderBy = [];
    /** An array containing all prefix definitions for the query. */
    this.prefixes = [];
    /** Indicates if some of the non-unique matches can be eliminated from the results. */
    this.reducedResults = false;
    /** An array of RDF triples which need to be matched. */
    this.triples = [];

    /**
     * Array containing the names of variables to return as a result of a query run. If the array is
     * empty, all variables in the query need to be returned.
     */
    this.variables = [];
};

/** Prototype for all jsw.rdf.Query objects. */
jsw.rdf.Query.prototype = {
    /** Defines constants by which different expressions can be distinguished in the query. */
    ExpressionTypes: {
        VAR: 0,
        LITERAL: 1,
        IRI_REF: 2
    },

    /**
     * Adds the given prefix to the query. Throws an error if the prefix with the given name but 
     * different IRI has been defined already.
     *
     * @param prefixName Name of the prefix to add.
     * @param iri IRI associated with the prefix.
     */
    addPrefix: function (prefixName, iri) {
        var existingIri = this.getPrefixIri(prefixName);

        if (existingIri === null) {
            this.prefixes.push({
                'prefixName': prefixName,
                'iri': iri
            });
        } else if (iri !== existingIri) {
            throw 'The prefix "' + prefixName + '" has been defined already in the query!';
        }
    },

    /**
     * Adds an RDF triple which needs to be matched to the query.
     */
    addTriple: function (subject, predicate, object) {
        this.triples.push({
            'subject': subject,
            'predicate': predicate,
            'object': object
        });
    },

    /**
     * Returns IRI for the prefix with the given name in the query.
     *
     * @param prefixName Name of the prefix.
     * @return IRI associated with the given prefix name in the query or null if no prefix with the
     * given name is defined.
     */
    getPrefixIri: function (prefixName) {
        var prefix,
            prefixes = this.prefixes,
            prefixIndex;
        
        for (prefixIndex = prefixes.length; prefixIndex--;) {
            prefix = prefixes[prefixIndex];

            if (prefix.prefixName === prefixName) {
                return prefix.iri.value;
            }
        }

        return null;
    }
};

// ============================== XSD namespace ===============================

jsw.xsd = {};

/** Contains the URIs of (some) datatypes of XML Schema. */
jsw.xsd.DataTypes = {
    /** IRI of boolean data type. */
    BOOLEAN: 'http://www.w3.org/2001/XMLSchema#boolean',
    /** IRI of decimal data type. */
    DECIMAL: 'http://www.w3.org/2001/XMLSchema#decimal',
    /** IRI of a double data type. */
    DOUBLE: 'http://www.w3.org/2001/XMLSchema#double',
    /** IRI of a integer data type. */
    INTEGER: 'http://www.w3.org/2001/XMLSchema#integer',
    /** IRI of a string data type. */
    STRING: 'http://www.w3.org/2001/XMLSchema#string'
};

// ============================= SPARQL namespace =============================
/**
 * An object which can be used to work with SPARQL queries.
 * 
 * The features currently not supported by the parser:
 *      - Proper relative IRI resolution;
 *      - Blank Nodes;
 *      - Comments;
 *      - Nested Graph Patterns;
 *      - FILTER expressions;
 *      - ORDER BY: expressions other than variables;
 *      - RDF Collections;
 *      - OPTIONAL patterns;
 *      - UNION of patterns;
 *      - FROM clause (and, hence, GRAPH clause and named graphs).
 */
jsw.sparql = {
    /** Defines data types of literals which can be parsed */
    DataTypes: jsw.xsd.DataTypes,
    /** Defines types of expressions which can be parsed */
    ExpressionTypes: jsw.rdf.Query.prototype.ExpressionTypes,

    /** Regular expression for SPARQL absolute IRI references. */
    absoluteIriRegExp: null, 
    /** Regular expression for SPARQL boolean literals. */
    boolRegExp: null,
    /** Regular expression for SPARQL decimal literals. */
    decimalRegExp: null,
    /** Regular expression for SPARQL double literals. */
    doubleRegExp: null,
    /** Regular expression for SPARQL integer literals. */
    intRegExp: null,
    /** Regular expression for SPARQL IRI references. */
    iriRegExp: null,
    /** Regular expression representing one of the values in the ORDER BY clause. */
    orderByValueRegExp: null,
    /** Regular expression for SPARQL prefixed names. */
    prefixedNameRegExp: null,
    /** Regular expression for SPARQL prefix name. */
    prefixRegExp: null,
    /** Regular expression for RDF literals. */
    rdfLiteralRegExp: null,
    /** Regular expression for SPARQL variables. */
    varRegExp: null,

    /**
     * Expands the given prefixed name into the IRI reference.
     *
     * @param prefix Prefix part of the name.
     * @param localName Local part of the name.
     * @return IRI reference represented by the given prefix name.
     */
    expandPrefixedName: function (prefix, localName, query) {

        var iri;

        if (!prefix && !localName) {
            throw 'Can not expand the given prefixed name, since both prefix and local name are ' +
                'empty!';
        }

        prefix = prefix || '';
        localName = localName || '';
                
        iri = query.getPrefixIri(prefix);

        if (iri === null) {
            throw 'Prefix "' + prefix + '" has not been defined in the query!';
        }
                    
        return iri + localName;
    },

    /** Initializes regular expressions used by parser. */
    init: function () {
        var pnCharsBase = "A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D" +
            "\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF" +
            "\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\u10000-\\uEFFFF",
            pnCharsU = pnCharsBase + "_",
            pnChars = pnCharsU + "0-9\\-\\u00B7\\u0300-\\u036F\\u203F-\\u2040",
            pnNameNs = "([" + pnCharsBase + "][" + pnChars + ".]*[" + pnChars + "])?:",
            pnLocal = "([" + pnCharsU + "0-9](?:[" + pnChars + ".]*[" + pnChars + "])?)?",
            varRegExp = "[?$][" + pnCharsU + "0-9][" + pnCharsU + "0-9\\u00B7\\u0300-\\u036F" +
            "\\u203F-\\u2040]*",
            string = "'((?:[^\\x27\\x5C\\xA\\xD]|\\[tbnrf\\\"'])*)'|" +
            '"((?:[^\\x22\\x5C\\xA\\xD]|\\[tbnrf\\"\'])*)"|' + 
            '"""((?:(?:"|"")?(?:[^"\\]|\\[tbnrf\\"\']))*)"""|' + 
            "'''((?:(?:'|'')?(?:[^'\\]|\\[tbnrf\\\"']))*)'''",
            iriRef = '<[^<>"{}|^`\\][\\x00-\\x20]*>',
            prefixedName = pnNameNs + pnLocal,
            exponent = '[eE][+-]?[0-9]+';

        this.absoluteIriRegExp = /^<\w*:\/\//; // TODO: This is not precise.
        this.boolRegExp = /^true$|^false$/i;
        this.intRegExp = /^(?:\+|-)?[0-9]+$/;
        this.decimalRegExp = /^(?:\+|-)?(?:[0-9]+\.[0-9]*|\.[0-9]+)$/;
        this.doubleRegExp = new RegExp('^(?:\\+|-)?(?:[0-9]+\\.[0-9]*' + exponent + '|\\.[0-9]+' +
            exponent + '|[0-9]+' + exponent + ')$');
        this.iriRegExp = new RegExp('^' + iriRef + '$');
        this.orderByValueRegExp = new RegExp('^(ASC|DESC)\\((' + varRegExp + ')\\)$|^' + varRegExp +
            '$', "i");
        this.prefixRegExp = new RegExp("^" + pnNameNs + "$");
        this.prefixedNameRegExp = new RegExp("^" + prefixedName + "$");
        this.rdfLiteralRegExp = new RegExp('^(?:' + string + ')(?:@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*)|' +
            '\\^\\^(' + iriRef + ')|\\^\\^' + prefixedName + ')?$');
        this.varRegExp = new RegExp('^' + varRegExp + '$');
    },

    /**
     * Parses the given SPARQL string into the query. 
     * 
     * @param queryTxt SPARQL string to parse into the query.
     * @return An object representing the query parsed.
     */
    parse: function (queryTxt) {
        var iri, object, predicate, prefix, query, subject, token, tokens, tokenCount, 
            tokenIndex, valueToRead, variable, vars;

        if (!queryTxt) {
            throw 'The query text is not specified!';
        }
        
        query = new jsw.rdf.Query();
        tokens = queryTxt.split(/\s+/);
        tokenCount = tokens.length;
        tokenIndex = 0;

        if (tokens[tokenIndex].toUpperCase() === 'BASE') {
            tokenIndex += 1;
            
            query.baseIri = this.parseAbsoluteIri(tokens[tokenIndex]);
            
            if (query.baseIri === null) {
                throw 'BASE statement does not contain a valid IRI reference!';
            }

            tokenIndex += 1;
        }

        // Read all PREFIX statements...
        while (tokenIndex < tokenCount) {
            token = tokens[tokenIndex];

            if (token.toUpperCase() !== 'PREFIX') {
                break;
            }

            tokenIndex += 1;

            if (tokenIndex === tokenCount) {
                throw 'Prefix name expected, but end of the query text found!';
            }

            prefix = this.parsePrefixName(tokens[tokenIndex]);

            if (prefix === null) {
                throw 'Token "' + token + '" does not represent a valid IRI prefix!';
            }

            tokenIndex += 1;
            
            if (tokenIndex === tokenCount) {
                throw 'Prefix IRI expected, but end of the query text found!';
            }

            iri = this.parseIriRef(tokens[tokenIndex], query);

            if (iri === null) {
                throw 'Incorrect format of the IRI encountered!';
            }

            query.addPrefix(prefix, iri);

            tokenIndex += 1;
        }
        
        // Parse SELECT clause.
        if (tokenIndex === tokenCount) {
            return query;
        } else if (token.toUpperCase() !== 'SELECT') {
            throw 'SELECT statement expected, but "' + token + '" was found!';
        }

        tokenIndex += 1;
        
        if (tokenIndex === tokenCount) {
            throw 'DISTINCT/REDUCED or variable declaration expected after "SELECT", but the end ' +
                'of query text was found!';
        }

        token = tokens[tokenIndex].toUpperCase();

        if (token === 'DISTINCT') {
            query.distinctResults = true;
            tokenIndex += 1;
        } else if (token === 'REDUCED') {
            query.reducedResults = true;
            tokenIndex += 1;
        }

        if (tokenIndex === tokenCount) {
            throw 'Variable declarations are expected after DISTINCT/REDUCED, but the end of ' +
                'the query text was found!';
        }

        token = tokens[tokenIndex];

        if (token === '*') {
            tokenIndex += 1;

            token = tokens[tokenIndex];
        } else {
            vars = [];

            // Parse SELECT variables.
            while (tokenIndex < tokenCount) {
                token = tokens[tokenIndex];

                if (token.toUpperCase() === 'WHERE' || token === '{') {
                    break;
                }

                variable = this.parseVar(token);
            
                if (variable) {
                    vars.push(variable);
                } else {
                    throw 'The token "' + token + '" does not represent the valid variable!';
                }

                tokenIndex += 1;
            }

            if (vars.length === 0) {
                throw 'No variable definitions found in the SELECT clause!';
            }

            query.variables = vars;
        }

        if (tokenIndex === tokenCount) {
            return query;
        } else if (token.toUpperCase() === 'WHERE') {
            if (tokens[tokenIndex + 1] === '{') {
                tokenIndex += 2; // Skip to the next token after '{'.    
            } else {
                throw 'WHERE clause should be surrounded with "{}"!';
            }
        } else if (token === '{') {
            tokenIndex += 1;
        } else {
            throw 'WHERE clause was expected, but "' + token + '" was found!';
        }

        // Parsing WHERE clause.
        valueToRead = 0;

        while (tokenIndex < tokenCount) {
            // TODO: Add parsing filters.
            token = tokens[tokenIndex];

            if (token === '}') {
                if (valueToRead === 0) {
                    break;
                } else {
                    throw 'RDF triple is not complete but the end of WHERE clause was found!';
                }
            }

            if (valueToRead === 0) {
                subject = this.parseVarOrTerm(token, query);

                if (subject === null) {
                    throw 'Subject variable or term was expected but "' + token + '" was found!';
                }

                tokenIndex += 1;
                valueToRead += 1;

                if (tokenIndex === tokenCount) {
                    throw 'Predicate of the RDF triple expected, reached the end of text instead!';
                }
            } else if (valueToRead === 1) {
                predicate = this.parseVerb(token, query);

                if (predicate === null) {
                    throw 'Predicate verb was expected but "' + token + '" was found!';
                }

                tokenIndex += 1;
                valueToRead += 1;

                if (tokenIndex === tokenCount) {
                    throw 'Object of the RDF triple expected, reached the end of text instead!';
                }
            } else if (valueToRead === 2) {
                object = this.parseVarOrTerm(token, query);

                if (object === null) {
                    throw 'Object variable or term was expected but "' + token + '" was found!';
                }

                query.addTriple(subject, predicate, object);

                valueToRead = 0;
                tokenIndex += 1;

                switch (tokens[tokenIndex]) {
                case '.':
                    valueToRead = 0;
                    tokenIndex += 1;
                    break;
                case ';':
                    valueToRead = 1;
                    tokenIndex += 1;
                    break;
                case ',':
                    valueToRead = 2;
                    tokenIndex += 1;
                    break;
                }
            }
        }

        if (tokenIndex === tokenCount) {
            throw '"}" expected but the end of query text found!';
        }

        tokenIndex += 1;

        if (tokenIndex === tokenCount) {
            return query;
        }
    
        if (tokens[tokenIndex].toUpperCase() === 'ORDER') {
            tokenIndex += 1;

            token = tokens[tokenIndex];


            if (token.toUpperCase() !== 'BY') {
                throw '"BY" expected after "ORDER", but "' + token + '" was found!';
            }

            tokenIndex += 1;

            while (tokenIndex < tokenCount) {
                token = tokens[tokenIndex];

                if (token.toUpperCase() === 'LIMIT' || token.toUpperCase() === 'OFFSET') {
                    break;
                }

                variable = this.parseOrderByValue(token);

                if (variable === null) {
                    throw 'Unknown token "' + token + '" was found in the ORDER BY clause!';
                }

                query.orderBy.push(variable);
                tokenIndex += 1;
            }
        }

        while (tokenIndex < tokenCount) {
            token = tokens[tokenIndex].toUpperCase();
            
            // Parse LIMIT clause.
            if (token === 'LIMIT') {
                tokenIndex += 1;

                if (tokenIndex === tokenCount) {
                    throw 'Integer expected after "LIMIT", but the end of query text found!';
                }

                token = tokens[tokenIndex];
                query.limit = parseInt(token, 10);

                if (isNaN(query.limit)) {
                    throw 'Integer expected after "LIMIT", but "' + token + '" found!';
                }

                tokenIndex += 1;
            } else if (token === 'OFFSET') {
                // Parse OFFSET clause.
                tokenIndex += 1;

                if (tokenIndex === tokenCount) {
                    throw 'Integer expected after "OFFSET", but the end of query text found!';
                }

                token = tokens[tokenIndex];
                query.offset = parseInt(token, 10);

                if (isNaN(query.offset)) {
                    throw 'Integer expected after "OFFSET", but "' + token + '" found!';
                }

                tokenIndex += 1;
            } else {
                throw 'Unexpected token "' + token + '" found!';
            }
        }

        return query;
    },

    /**
     * Parses the given string into the absolute IRI.
     *
     * @param token String containing the IRI.
     * @return Absolute IRI parsed from the string or null if the given string does not represent
     * an absolute IRI.
     */
    parseAbsoluteIri: function (token) {
        if (!this.iriRegExp) {
            this.init();
        }

        if (this.iriRegExp.test(token) && this.absoluteIriRegExp.test(token)) {
            return token.substring(1, token.length - 1);
        } else {
            return null;
        }
    },

    /**
     * Parses the given string into the object representing an IRI.
     *
     * @param token String containing the IRI.
     * @param baseIri IRI to use for resolving relative IRIs.
     * @return Object representing the IRI parsed or null if the given string does not represent an
     * IRI.
     */
    parseIriRef: function (token, baseIri) {
        var iriRef;

        if (!this.iriRegExp) {
            this.init();
        }

        if (!this.iriRegExp.test(token)) {
            return null;
        }
        
        if (!baseIri || this.absoluteIriRegExp.test(token)) {
            iriRef = token.substring(1, token.length - 1);
        } else {
            // TODO: This is very basic resolution!
            iriRef = baseIri + token.substring(1, token.length - 1);
        }

        return {
            'type': this.ExpressionTypes.IRI_REF,
            'value': iriRef
        };
    },

    /**
     * Parses the given string into a literal.
     *
     * @param token String containing the literal.
     * @return Literal parsed from the string or null if the token does not represent a valid
     * literal.
     */
    parseLiteral: function (token, query) {
        var dataTypeIri, localName, matches, matchIndex, prefix, value;

        if (!this.rdfLiteralRegExp) {
            this.init();
        }

        matches = token.match(this.rdfLiteralRegExp);

        if (matches) {
            for (matchIndex = 1; matchIndex <= 4; matchIndex += 1) {
                value = matches[matchIndex];

                if (value) {
                    break;
                }
            }

            dataTypeIri = matches[6] || null;

            if (!dataTypeIri) {
                prefix = matches[7] || '';
                localName = matches[8] || '';
                
                if (prefix !== '' || localName !== '') {
                    dataTypeIri = this.expandPrefixedName(prefix, localName, query);
                } else {
                    dataTypeIri = this.DataTypes.STRING;
                }
            }

            return {
                'type': this.ExpressionTypes.LITERAL,
                'value': value,
                'lang': matches[5] || null,
                'dataType': dataTypeIri
            };
        }

        if (this.intRegExp.test(token)) {
            return {
                'type': this.ExpressionTypes.LITERAL,
                'value': token,
                'dataType': this.DataTypes.INTEGER
            };
        }

        if (this.decimalRegExp.test(token)) {
            return {
                'type': this.ExpressionTypes.LITERAL,
                'value': token,
                'dataType': this.DataTypes.DECIMAL
            };
        }

        if (this.doubleRegExp.test(token)) {
            return {
                'type': this.ExpressionTypes.LITERAL,
                'value': token,
                'dataType': this.DataTypes.DOUBLE
            };
        }

        if (this.boolRegExp.test(token)) {
            return {
                'type': this.ExpressionTypes.LITERAL,
                'value': token,
                'dataType': this.DataTypes.BOOLEAN
            };
        }

        return null;
    },

    /**
     * Parses the given string into the object representing some value found in the order by clause.
     *
     * @param token String to parse.
     * @return Object representing the order by value parsed or null if token does not reperesent
     * a valid order by value.
     */
    parseOrderByValue: function (token) {
        // TODO: support not only variables in ORDER BY.
        var match, prefix;

        if (!this.orderByValueRegExp) {
            this.init();
        }

        match = token.match(this.orderByValueRegExp);

        if (match) {
            prefix = match[1];

            if (!prefix) {
                return {
                    'type': this.ExpressionTypes.VAR,
                    'value': match[0].substring(1), // remove the ? or $ in the variable
                    'order': 'ASC'
                };
            }

            return {
                'type': this.ExpressionTypes.VAR,
                'value': match[2].substring(1), // remove the ? or $ in the variable
                'order': match[1].toUpperCase()
            };
        }

        return null;
    },

    /**
     * Parses the given string into the IRI, assuming that it is a prefixed name.
     *
     * @param token String containing prefixed name.
     * @param query Query object with defined prefixes, which can be used for name expansion.
     * @return Object representing the prefixed name parsed or null if the token is not a prefixed
     * name.
     */
    parsePrefixedName: function (token, query) {
        var match;

        if (!this.prefixedNameRegExp) {
            this.init();
        }
        
        match = token.match(this.prefixedNameRegExp);

        if (!match) {
            return null;
        }

        return {
            'type': this.ExpressionTypes.IRI_REF,
            'value': this.expandPrefixedName(match[1], match[2], query)
        };
    },

    /**
     * Parses the given string into the string representing the prefix name.
     *
     * @param token String containing the prefix name.
     * @return Prefix name parsed or null if the given string does not contain a prefix name.
     */
    parsePrefixName: function (token) {
        if (!this.prefixRegExp) {
            this.init();
        }

        return (this.prefixRegExp.test(token)) ? token.substring(0, token.length - 1) : null;
    },

    /**
     * Returns a SPARQL variable or term represented by the given string.
     *
     * @param token String to parse into the variable or term.
     * @param query Reference to the query for which the variable or term is parsed.
     * @return Object representing the variable or a term parsed.
     */
    parseVarOrTerm: function (token, query) {
        // See if it is a variable.
        var value = this.parseVar(token);
        
        if (value) {
            return value;
        }

        // See if it is an IRI reference.
        value = this.parseIriRef(token, query.baseIri);

        if (value) {
            return value;
        }

        // See if it is a prefixed name.
        value = this.parsePrefixedName(token, query);

        if (value) {
            return value;
        }

        // See if it is a literal.
        value = this.parseLiteral(token, query);
        
        if (value) {
            return value;
        }

        return null;
    },

    /**
     * Parses a token into the variable.

     *
     * @param token Contains the text representing SPARQL variable.
     * @return Object representing the SPARQL variable, or null if the given token does not
     * represent a valid SPARQL variable.
     */
    parseVar: function (token) {
        if (this.varRegExp === null) {
            this.init();
        }        
        
        if (!this.varRegExp.test(token)) {
            return null;
        }

        return {
            'type': this.ExpressionTypes.VAR,
            'value': token.substring(1) // Skip the initial '?' or '$'
        };
    },

    /**
     * Parses a token into the SPARQL verb.
     *
     * @param token String containing a SPARQL verb.
     * @param query Reference to the query for which the variable or term is parsed.
     * @return Object representing the SPARQL verb, or null if the given token does not represent a
     * valid SPARQL verb.
     */
    parseVerb: function (token, query) {
        // See if it is a variable.
        var value = this.parseVar(token);
        
        if (value) {
            return value;
        }

        // See if it is an IRI reference.
        value = this.parseIriRef(token, query.baseIri);

        if (value) {
            return value;
        }

        // See if it is a prefixed name.
        value = this.parsePrefixedName(token, query);

        if (value) {
            return value;
        }

        if (token === 'a') {
            return {
                'type': this.ExpressionTypes.IRI_REF,
                'value':  jsw.rdf.IRIs.TYPE
            };
        }

        return null;
    }
};

// =============================== OWL namespace ==============================

jsw.owl = {};

/** Defines types of expressions the objects in OWL namespace can work with.*/
jsw.owl.ExpressionTypes = {
    /** SubClassOf axiom. */
    AXIOM_CLASS_SUB: 0,
    /** EquivalentClasses axiom. */
    AXIOM_CLASS_EQ: 1,
    /** DisjointClasses axiom */
    AXIOM_CLASS_DISJOINT: 2,
    /** SubObjectPropertyOf axiom. */
    AXIOM_OPROP_SUB: 3,
    /** EquivalentObjectProperties axiom. */
    AXIOM_OPROP_EQ: 4,
    /** ReflexiveObjectProperty axiom */
    AXIOM_OPROP_REFL: 5,
    /** TransitiveObjectProperty axiom */
    AXIOM_OPROP_TRAN: 6,
    /** ObjectIntersectionOf class expression. */
    CE_INTERSECT: 7,
    /** ObjectSomeValuesFrom class expression. */
    CE_OBJ_VALUES_FROM: 8,
    /** Class entity. */
    ET_CLASS: 9,
    /** ObjectProperty entity. */
    ET_OPROP: 10,
    /** (Named)Individual entity. */
    ET_INDIVIDUAL: 11,
    /** ClassAssertion fact. */
    FACT_CLASS: 12,
    /** ObjectPropertyAssertion fact. */
    FACT_OPROP: 13,
    /** SameIndividual fact */
    FACT_SAME_INDIVIDUAL: 14,
    /** DifferentIndividuals fact */
    FACT_DIFFERENT_INDIVIDUALS: 15,
    /** ObjectPropertyChain object property expression. */
    OPE_CHAIN: 16
};

/** Defines important IRIs in the OWL namespace. */
jsw.owl.IRIs = {
    /** Top concept. */
    THING: 'http://www.w3.org/2002/07/owl#Thing',
    /** Bottom concept. */
    NOTHING: 'http://www.w3.org/2002/07/owl#Nothing',
    /** Top object property. */
    TOP_OBJECT_PROPERTY: 'http://www.w3.org/2002/07/owl#topObjectProperty',
    /** Bottom object property. */
    BOTTOM_OBJECT_PROPERTY: 'http://www.w3.org/2002/07/owl#bottomObjectProperty'    
};

/** An object allowing to work with OWL/XML format. */
jsw.owl.xml = {
    /**
     * Parses the given OWL/XML string into the Ontology object.
     * 
     * @param owlXml String containing OWL/XML to be parsed.
     * @param onError Function to be called in case if the parsing error occurs.
     * @return Ontology object representing the ontology parsed.
     */
    parse: function (owlXml, onError) {
        var exprTypes = jsw.owl.ExpressionTypes, // Cash reference to the constants.
            node, // Will hold the current node being parsed.
            ontology = new jsw.owl.Ontology(), // The ontology to be returned.
            statements = ontology.axioms; // Will contain all statements.
   
        /**
         * Parses XML element representing some entity into the object. Throws an exception if the
         * name of the given element is not equal to typeName.
         * 
         * @param type Type of the entity represented by the XML element.
         * @param typeName Name of the OWL/XML element which corresponds to the given entity type.
         * @param element XML element representing some entity.
         * @param isDeclared (optional) Indicates whether the entity has been just declared in the ontology.
         * False by default.
         * @return Object representing the entity parsed. 
         */
        function parseEntity(type, typeName, element, isDeclared) {
            var abbrIri, colonPos, entity, iri;
         
            if (element.nodeName !== typeName) {
                throw typeName + ' element expected, but not found!';
            }

            abbrIri = element.getAttribute('abbreviatedIRI');
            iri = element.getAttribute('IRI');

            // If both attributes or neither are defined on the entity, it is an error.

            if ((!iri && !abbrIri) || (iri && abbrIri)) {
                throw 'Exactly one of IRI or abbreviatedIRI attribute must be present in ' + 
                    element.nodeName + ' element!';
            }
         
            if (!abbrIri) {
                entity = {
                    'type': type,
                    'IRI': iri
                };
            } else {
                colonPos = abbrIri.indexOf(':');

                if (colonPos < 0) {
                    throw 'Abbreviated IRI "' + abbrIri + '" does not contain a prefix name!';
                }
                
                if (colonPos === abbrIri.length - 1) {
                    throw 'Abbreviated IRI "' + abbrIri + '" does not contain anything after ' +
                        'the prefix!';
                }

                iri = ontology.resolveAbbreviatedIRI(
                    abbrIri.substring(0, colonPos),
                    abbrIri.substring(colonPos + 1)
                );

                // Store information about abbreviated entity IRI, so that it can be used when
                // writing the ontology back in OWL/XML.
                entity = {
                    'type': type,
                    'IRI': iri,
                    'abbrIRI': abbrIri
                };
            }

            ontology.registerEntity(type, iri, isDeclared);
            return entity;
        }
      
        /**
         * Parses XML element representing class intersection expression.
         * 
         * @param element XML element representing class intersection expression.
         * @return Object representing the class intersection expression. 
         */
        function parseObjIntersectExpr(element) {
            var classExprs = [],
                node = element.firstChild;
            
            while (node) {
                if (node.nodeType === 1) {            
                    classExprs.push(parseClassExpr(node));
                }

                node = node.nextSibling;
            }
         
            return {
                'type': exprTypes.CE_INTERSECT,
                'args': classExprs
            };
        }
      
        /**
         * Parses XML element representing ObjectSomeValuesFrom expression.
         * 
         * @param element XML element representing the ObjectSomeValuesFrom expression.
         * @return Object representing the expression parsed.
         */
        function parseSomeValuesFromExpr(element) {
            var oprop, classExpr, node;

            node = element.firstChild;

            while (node) {
                if (node.nodeType !== 1) {
                    node = node.nextSibling;
                    continue;
                }
            
                if (!oprop) {
                    oprop = parseEntity(exprTypes.ET_OPROP, 'ObjectProperty', node);
                } else if (!classExpr) {
                    classExpr = parseClassExpr(node);
                } else {
                    throw 'The format of ObjectSomeValuesFrom expression is incorrect!';
                }

                node = node.nextSibling;
            }
         
            if (!oprop || !classExpr) {
                throw 'The format of ObjectSomeValuesFrom expression is incorrect!';
            }
         
            return {
                'type': exprTypes.CE_OBJ_VALUES_FROM,
                'opropExpr': oprop,
                'classExpr': classExpr

            };
        }
      
        /**
         * Parses the given XML node into the class expression.
         *
         * @param element XML node containing class expression to parse.
         * @return An object representing the class expression parsed.
         */
        function parseClassExpr(element) {
            switch (element.nodeName) {
            case 'ObjectIntersectionOf': 
                return parseObjIntersectExpr(element);
            case 'ObjectSomeValuesFrom': 
                return parseSomeValuesFromExpr(element);
            default: 
                return parseEntity(exprTypes.ET_CLASS, 'Class', element);
            }
        }
      
        /**
         * Parses an XML element representing the object property chain into the object.
         *
         * @param element Element representing an object property chain.
         * @return Object representing the object property chain parsed.
         */
        function parseOpropChain(element) {
            var args = [],
                node = element.firstChild,
                opropType = exprTypes.ET_OPROP;
             
            while (node) {
                if (node.nodeType === 1) {
                    args.push(parseEntity(opropType, 'ObjectProperty', node));
                }

                node = node.nextSibling;
            }
         
            if (args.length < 2) {
                throw 'The object property chain should contain at least 2 object properties!';
            }
         
            return {
                'type': exprTypes.OPE_CHAIN,
                'args': args            
            };
        }
      
        /**
         * Parses XML element representing SubObjectPropertyOf axiom into the object.
         * 
         * @param element OWL/XML element representing SubObjectPropertyOf axiom.
         */
        function parseSubOpropAxiom(element) {
            var firstArg, secondArg, node, opropType;
            
            opropType = exprTypes.ET_OPROP;
            node = element.firstChild; 

            while (node) {
                if (node.nodeType !== 1) {
                    node = node.nextSibling;
                    continue;
                }
            
                if (!firstArg) {
                    if (node.nodeName === 'ObjectPropertyChain') {
                        firstArg = parseOpropChain(node);
                    } else {
                        firstArg = parseEntity(opropType, 'ObjectProperty', node);
                    }
                } else if (!secondArg) {
                    secondArg = parseEntity(opropType, 'ObjectProperty', node);
                } else {
                    throw 'The format of SubObjectPropertyOf axiom is incorrect!';
                }

                node = node.nextSibling;
            }
         
            if (!firstArg || !secondArg) {
                throw 'The format of SubObjectPropertyOf axiom is incorrect!';
            }
         
            statements.push({
                'type': exprTypes.AXIOM_OPROP_SUB,
                'args': [firstArg, secondArg] 
            });
        }
      
        /**
         * Parse XML element representing a class axiom into the object.
         * 
         * @param type Type of the class axiom to parse.
         * @param element XML element representing the class axiom to parse. 
         * @param minExprCount Minimum number of times the class expressions should occur in the 
         * axiom.
         * @param maxExprCount Maximum number of times the class expressions should occur in the
         * axiom.
         */
        function parseClassAxiom(type, element, minExprCount, maxExprCount) {
            var args = [],
                node = element.firstChild;

          
            while (node) {
                if (node.nodeType === 1) {
                    args.push(parseClassExpr(node));
                }

                node = node.nextSibling;
            }
	    
            if (!isNaN(minExprCount) && args.length < minExprCount) {
                throw 'Class axiom contains less than ' + minExprCount + ' class expressions!';
            }
          
            if (!isNaN(maxExprCount) && args.length > maxExprCount) {
                throw 'Class axiom contains more than ' + maxExprCount + ' class expressions!';
            }

            statements.push({
                'type': type,
                'args': args
            });
        }

        /**
         * Parses EquivalentObjectProperties XML element into the corresponding object.
         *
         * @param element OWL/XML element representing the EquivalentObjectProperties axiom.
         */
        function parseEqOpropAxiom(element) {
            var args = [],
                node = element.firstChild,
                opropType = exprTypes.ET_OPROP;
          
            while (node) {
                if (node.nodeType === 1) {
                    args.push(parseEntity(opropType, 'ObjectProperty', node));
                }

                node = node.nextSibling;
            }
	    
            if (args.length < 2) {
                throw 'EquivalentObjectProperties axiom contains less than 2 child elements!';
            }

            statements.push({
                'type': exprTypes.AXIOM_OPROP_EQ,
                'args': args
            });
        }

        /**
         * Parses the given XML element into the object property axiom of the given type.
         *
         * @param type Type of an object property axiom represented by the element.
         * @param element XML element to parse into the axiom object.
         */
        function parseOpropAxiom(type, element) {
            var node = element.firstChild,
                oprop;
          
            while (node) {
                if (node.nodeType === 1) {
                    if (!oprop) {
                        oprop = parseEntity(exprTypes.ET_OPROP, 'ObjectProperty', node);
                    } else {
                        throw 'Unexpected element ' + node.nodeName + ' found inside the object ' +
                            'property axiom element!';
                    }
                }

                node = node.nextSibling;
            }

            if (!oprop) {
                throw 'Object property axiom does not contain an argument!';
            }

            statements.push({
                'type': type,
                'objectProperty': oprop
            });
        }

        /**
         * Parses Declaration OWL/XML element into the corresponding entity object within the
         * ontology.
         *
         * @param element OWL/XML Declaration element to parse.
         */
        function parseDeclaration(element) {
            var found = false,
                node = element.firstChild,
                nodeName;

            // This will not detect (and report) declarations of other entity types. On purpose.
            while (node) {
                if (node.nodeType === 1) {
                    nodeName = node.nodeName;

                    if (found) {
                        throw 'Unexpected element "' + nodeName + '" found in Declaration element!';
                    }

                    switch (nodeName) {
                    case 'Class':
                        parseEntity(exprTypes.ET_CLASS, 'Class', node, true);
                        found = true;
                        break;
                    case 'ObjectProperty':
                        parseEntity(exprTypes.ET_OPROP, 'ObjectProperty', node, true);
                        found = true;
                        break;
                    case 'NamedIndividual':
                        parseEntity(exprTypes.ET_INDIVIDUAL, 'NamedIndividual', node, true);
                        found = true;
                        break;
                    }
                }

                node = node.nextSibling;
            }
        }

        /**
         * Parses ClassAssertion XML element into the corresponding object.
         * 
         * @param element OWL/XML ClassAssertion element.
         */
        function parseClassAssertion(element) {
            var classExpr, individual, node;

            node = element.firstChild;
          
            while (node) {
                if (node.nodeType !== 1) {
                    node = node.nextSibling;
                    continue;
                }
            
                if (!classExpr) {
                    classExpr = parseClassExpr(node);
	            } else if (!individual) {
                    individual = parseEntity(exprTypes.ET_INDIVIDUAL, 'NamedIndividual', node);
                } else {
                    throw 'Incorrect format of the ClassAssertion element!';
                }

                node = node.nextSibling;               
            }
         
            if (!classExpr || !individual) {
                throw 'Incorrect format of the ClassAssertion element!';
            }
         
            statements.push({
                'type': exprTypes.FACT_CLASS,
                'individual': individual, 
                'classExpr': classExpr
            });
        }
      
        /**
         * Parses ObjectPropertyAssertion OWL/XML element into the corresponding object.
         * 
         * @param element OWL/XML ObjectPropertyAssertion element to parse.
         */
        function parseObjectPropertyAssertion(element) {
            var individualType, leftIndividual, node, objectProperty, rightIndividual;

            individualType = exprTypes.ET_INDIVIDUAL;
            node = element.firstChild;

            while (node) {
                if (node.nodeType !== 1) {
                    node = node.nextSibling;
                    continue;
                }

                if (!objectProperty) {
                    objectProperty = parseEntity(exprTypes.ET_OPROP, 'ObjectProperty', node);
	            } else if (!leftIndividual) {
                    leftIndividual = parseEntity(individualType, 'NamedIndividual', node);
                } else if (!rightIndividual) {
	                rightIndividual = parseEntity(individualType, 'NamedIndividual', node);
                } else {
                    throw 'Incorrect format of the ObjectPropertyAssertion element!';
                }
                
                node = node.nextSibling;
            }
        
            if (!objectProperty || !leftIndividual || !rightIndividual) {
                throw 'Incorrect format of the ObjectPropertyAssertion element!';
            }
         
            statements.push({
                'type': exprTypes.FACT_OPROP,
                'leftIndividual': leftIndividual,
                'objectProperty': objectProperty, 
                'rightIndividual': rightIndividual
            });
        }
      
        /**
         * Parses OWL/XML element representing an assertion about individuals into the corresponding
         * object.
         * 
         * @param element OWL/XML element to parse.
         */
        function parseIndividualAssertion(element, type) {
            var individuals, individualType, node;

            individualType = exprTypes.ET_INDIVIDUAL;
            node = element.firstChild;
            individuals = [];

            while (node) {
                if (node.nodeType !== 1) {
                    node = node.nextSibling;
                    continue;
                }

                individuals.push(parseEntity(individualType, 'NamedIndividual', node));
                node = node.nextSibling;
            }
        
            if (individuals.length < 2) {
                throw 'Incorrect format of the ' + element.nodeName + ' element!';
            }
         
            statements.push({
                'type': type,
                'individuals': individuals
            });
        }
      
        /**
         * Parses the given OWL/XML Prefix element and adds the information about this prefix to the
         * ontology.
         *
         * @param element OWL/XML Prefix element.
         */
        function parsePrefixDefinition(element) {
            var prefixName = element.getAttribute('name'),
                prefixIri = element.getAttribute('IRI');

            if (prefixName === null || !prefixIri) {
                throw 'Incorrect format of Prefix element!';
            }

            ontology.addPrefix(prefixName, prefixIri);
        }
      
        node = jsw.util.xml.parseString(owlXml).documentElement.firstChild;
    
        // OWL/XML Prefix statements (if any) should be at the start of the document. We need them
        // to expand abbreviated entity IRIs.
        while (node) {
            if (node.nodeType === 1) {
                if (node.nodeName === 'Prefix') {
                    parsePrefixDefinition(node);
                } else {
                    break;
                }
            }

            node = node.nextSibling;
        }
      
        // Axioms / facts (if any) follow next.
        while (node) {
            if (node.nodeType !== 1) {
                node = node.nextSibling;
                continue;
            }
         
            try {
                switch (node.nodeName) {
                case 'Declaration':
                    parseDeclaration(node);
                    break;
                case 'SubClassOf':
                    parseClassAxiom(exprTypes.AXIOM_CLASS_SUB, node, 2, 2);
                    break;
                case 'EquivalentClasses':
                    parseClassAxiom(exprTypes.AXIOM_CLASS_EQ, node, 2);
                    break;
                case 'DisjointClasses':
                    parseClassAxiom(exprTypes.AXIOM_CLASS_DISJOINT, node, 2);
                    break;
                case 'SubObjectPropertyOf':
                    parseSubOpropAxiom(node);
                    break;
                case 'EquivalentObjectProperties':
                    parseEqOpropAxiom(node);
                    break;
                case 'ReflexiveObjectProperty':
                    parseOpropAxiom(exprTypes.AXIOM_OPROP_REFL, node);
                    break;
                case 'TransitiveObjectProperty':
                    parseOpropAxiom(exprTypes.AXIOM_OPROP_TRAN, node);
                    break;
                case 'ClassAssertion':
                    parseClassAssertion(node);
                    break;
                case 'ObjectPropertyAssertion':
                    parseObjectPropertyAssertion(node);
                    break;
                case 'SameIndividual':
                    parseIndividualAssertion(node, exprTypes.FACT_SAME_INDIVIDUAL);
                    break;
                case 'DifferentIndividuals':
                    parseIndividualAssertion(node, exprTypes.FACT_DIFFERENT_INDIVIDUALS);
                    break;
                case 'Prefix':
                    throw 'Prefix elements should be at the start of the document!';
                }
            } catch (ex) {
                if (!onError || !onError(ex)) {
                    throw ex;
                }
            }

            node = node.nextSibling;
        }
      
        return ontology;
    },
  
    /**
     * Parses the OWL/XML ontology located at the given url.
     * 
     * @param url URL of the OWL/XML ontology to be parsed.
     * @param onError Function to be called in case if the parsing error occurs.
     * @return Ontology object representing the ontology parsed.
     */
    parseUrl: function (url, onError) {
        var newUrl = jsw.util.string.trim(url),
            owlXml;
        
        if (!jsw.util.string.isUrl(newUrl)) {
            throw '"' + url + '" is not a valid URL!';
        }
        
        owlXml = new jsw.util.TextFile(url).getText();
        return this.parse(owlXml);
    },
  
    /**
     * Builds an OWL/XML string representing the given ontology.
     * 
     * @param ontology Ontology to return the OWL/XML representation for.
     * @return OWL/XML representing the given ontology.
     */
    write: function (ontology) {
        var axiom, // Currently processed statement from the ontology.
            axioms = ontology.axioms,
            axiomCount = axioms.length,
            axiomIndex, // Index of the statement currently processed.
            exprTypes = jsw.owl.ExpressionTypes, // Cashed constants.
            owlXml = '<Ontology>', // Will hold ontology OWL/XML produced.
            prefixes = ontology.prefixes,
            prefixName; 
         
        /**
         * Returns OWL/XML representation for the given OWL entity.
         * 
         * @param entity Entity to return OWL/XML representation for.
         * @param entityName Name of XML tag to use for the entity.
         * @return OWL/XML representation for the given OWL entity.
         */
        function writeEntity(entity, entityName) {
            var owlXml = '<' + entityName;
        
            if (entity.abbrIri) {
                owlXml += ' abbreviatedIRI="' + entity.abbrIri + '"';
            } else {
                owlXml += ' IRI="' + entity.IRI + '"';
            }
        
            owlXml += '/>';
            return owlXml;
        }
        
        /**
         * Returns OWL/XML representation for the given OWL class intersection expression.
         * 
         * @param expr Class intersection expression to return the OWL/XML representation for.
         * @return OWL/XML representation for the given OWL class intersection
         * expression.
         */
        function writeObjIntersectOfExpr(expr) {
            var owlXml = '<ObjectIntersectionOf>',
                subExprs = expr.args,
                subExprCount = subExprs.length,
                subExprIndex;
        
            for (subExprIndex = 0; subExprIndex < subExprCount; subExprIndex += 1) {
                owlXml += writeClassExpr(subExprs[subExprIndex]);
            }
        
            owlXml += '</ObjectIntersectionOf>';
            return owlXml;
        }
     
	    /**
         * Returns OWL/XML representation for the given OWL ObjectSomeValuesFrom expression.
         * 
         * @param expr ObjectSomeValuesFrom expression to return the OWL/XML representation for.
         * @return OWL/XML representation for the given OWL ObjectSomeValuesFrom expression.
         */
        function writeSomeValuesFromExpr(expr) {
            return '<ObjectSomeValuesFrom>' +
                writeEntity(expr.opropExpr, 'ObjectProperty') + 
                writeClassExpr(expr.classExpr) +
                '</ObjectSomeValuesFrom>';
        }
     
        /**
         * Returns OWL/XML representation for the given OWL class expression.
         * 
         * @param expr Class expression to return the OWL/XML representation for.
         * @return OWL/XML representation for the given OWL class expression.
         */
        function writeClassExpr(expr) {
            switch (expr.type) {
	        case exprTypes.ET_CLASS:
                return writeEntity(expr, 'Class');
	        case exprTypes.CE_INTERSECT:
	            return writeObjIntersectOfExpr(expr);
            case exprTypes.CE_OBJ_VALUES_FROM:
                return writeSomeValuesFromExpr(expr);
            default:
                throw 'Uncrecognized class expression!';               
	        }
        }
     
        /**
         * Returns OWL/XML representation for the given OWL class axiom.
         * 
         * @param axiom Class axiom.
         * @param elementName Name of the XML element to use.
         * @return OWL/XML representation for the given OWL class axiom.
         */
        function writeClassAxiom(axiom, elementName) {
            var args = axiom.args,
                argCount = args.length,
                argIndex,
                owlXml = '<' + elementName + '>';
        
            for (argIndex = 0; argIndex < argCount; argIndex += 1) {

                owlXml += writeClassExpr(args[argIndex]);
            }
        
            owlXml += '</' + elementName + '>';
            return owlXml;
        }
     
	    /**
         * Returns OWL/XML representation for the given OWL ObjectPropertyChain expression.
         * 
         * @param expr OWL ObjectPropertyChain expression to return the OWL/XML representation for.
         * @return OWL/XML representation for the given OWL ObjectPropertyChain expression.
         */
        function writeOpropChain(expr) {
            var args = expr.args,
                argCount = args.length,
                argIndex,
                owlXml = '<ObjectPropertyChain>';
        
            for (argIndex = 0; argIndex < argCount; argIndex += 1) {
                owlXml += writeEntity(args[argIndex], 'ObjectProperty');
            }
        
            owlXml += '</ObjectPropertyChain>';
            return owlXml;
        }
     
         /**
          * Returns OWL/XML representation for the given OWL SubObjectPropertyOf axiom.
          * 
          * @param expr OWL SubObjectPropertyOf axiom to return the OWL/XML representation for.
          * @return OWL/XML representation for the given OWL SubObjectPropertyOf axiom.
          */
        function writeOpropSubAxiom(axiom) {
            var firstArg = axiom.args[0],
                owlXml = '<SubObjectPropertyOf>';
    
            if (firstArg.type === exprTypes.OPE_CHAIN) {
                owlXml += writeOpropChain(firstArg);
            } else if (firstArg.type === exprTypes.ET_OPROP) {
                owlXml += writeEntity(firstArg, 'ObjectProperty');
            } else {
                throw 'Unknown type of the expression in the SubObjectPropertyOf axiom!';
            }
        
            owlXml += writeEntity(axiom.args[1], 'ObjectProperty');
            owlXml += '</SubObjectPropertyOf>';
            return owlXml;
        }

        /**
         * Returns OWL/XML representation for the given OWL EquivalentObjectProperties axiom.
         * 
         * @param axiom An object representing EquivalentObjectProperties axiom.
         * @return OWL/XML representation for the given axiom.
         */
        function writeEqOpropAxiom(axiom) {
            var arg,
                args = axiom.args,
                argCount = args.length,
                argIndex,
                owlXml = '<EquivalentObjectProperties>';
        
            for (argIndex = 0; argIndex < argCount; argIndex += 1) {
                arg = args[argIndex];

                if (arg && arg.type === exprTypes.ET_OPROP) {
                    owlXml += writeEntity(arg, 'ObjectProperty');
                } else {
                    throw 'Unrecognized type of expression found in the arguments of the ' +
                        'EquivalentObjectProperties axiom at the position ' + argIndex + '!';
                }
            }
        
            owlXml += '</EquivalentObjectProperties>';
            return owlXml;
        }

        /**
         * Returns OWL/XML representation for the given OWL object property axiom.
         * 
         * @param axiom An object representing an object property axiom.
         * @param name Name of the OWL/XML element to use for the axiom.
         * @return OWL/XML representation for the given axiom.
         */
        function writeOpropAxiom(axiom, name) {
            return '<' + name + '>' +
                writeEntity(axiom.objectProperty, 'ObjectProperty') +
                '</' + name + '>';
        }

        /**
         * Returns an OWL/XML string representing the given OWL ObjectPropertyAssertion statement.
         *
         * @param assertion OWL ObjectPropertyAssertion statement.
         * @return Fragment of OWL/XML representing the given statement.
         */
        function writeOpropAssertion(assertion) {
            return '<ObjectPropertyAssertion>' + 
                writeEntity(assertion.objectProperty, 'ObjectProperty') +
                writeEntity(assertion.leftIndividual, 'NamedIndividual') +
                writeEntity(assertion.rightIndividual, 'NamedIndividual') +
                '</ObjectPropertyAssertion>';
        }
        
        /**
         * Returns an OWL/XML string representing the given OWL ClassAssertion statement.
         *
         * @param assertion OWL ClassAssertion statement.
         * @return Fragment of OWL/XML representing the given statement.
         */
        function writeClassAssertion(assertion) {
            return '<ClassAssertion>' +
                writeEntity(assertion.className, 'Class') +
                writeEntity(assertion.individual, 'NamedIndividual') +
                '<ClassAssertion>';
        }

        /**
         * Returns an OWL/XML string representing the given OWL assertion about individuals.
         *
         * @param assertion OWL assertion about individuals.
         * @return Fragment of OWL/XML representing the given statement.
         */
        function writeIndividualAssertion(assertion, elementName) {
            var individuals = assertion.individuals,
                individualCount = individuals.length,
                individualIndex,
                owlXml = '<' + elementName + '>';
            
            for (individualIndex = 0; individualIndex < individualCount; individualIndex++) {
                owlXml += writeEntity(individuals[individualIndex], 'NamedIndividual');
            }
            
            return owlXml + '</' + elementName + '>'; 
        }

        /**
         * Returns an OWL/XML string with the definition of the prefix with the given name and IRI.
         *
         * @param prefixName Name of the prefix.
         * @param prefixIri IRI of the prefix.
         * @return Fragment of OWL/XML with the definition of the prefix.
         */
        function writePrefixDefinition(prefixName, prefixIri) {
            return '<Prefix name="' + prefixName + '" IRI="' + prefixIri + '"/>';
        }

        // MAIN BODY

        // We output prefixes first.
        for (prefixName in prefixes) {
            if (prefixes.hasOwnProperty(prefixName)) {
                owlXml += writePrefixDefinition(prefixName, prefixes[prefixName]);
            }
        }

        // And then output axioms/facts.
        for (axiomIndex = 0; axiomIndex < axiomCount; axiomIndex += 1) {
            axiom = axioms[axiomIndex];
        
            switch (axiom.type) {
            case exprTypes.AXIOM_CLASS_EQ:
                owlXml += writeClassAxiom(axiom, 'EquivalentClasses');
                break;
            case exprTypes.AXIOM_CLASS_SUB:
                owlXml += writeClassAxiom(axiom, 'SubClassOf');
                break;
            case exprTypes.AXIOM_CLASS_DISJOINT:
                owlXml += writeClassAxiom(axiom, 'DisjointClasses');
                break;
            case exprTypes.AXIOM_OPROP_SUB:
                owlXml += writeOpropSubAxiom(axiom);
                break;
            case exprTypes.AXIOM_OPROP_EQ:
                owlXml += writeEqOpropAxiom(axiom);
                break;
            case exprTypes.AXIOM_OPROP_REFL:
                owlXml += writeOpropAxiom(axiom, 'ReflexiveObjectProperty');
                break;
            case exprTypes.AXIOM_OPROP_TRAN:
                owlXml += writeOpropAxiom(axiom, 'TransitiveObjectProperty');
                break;
            case exprTypes.FACT_CLASS:
                owlXml += writeClassAssertion(axiom);
                break;
            case exprTypes.FACT_OPROP:
                owlXml += writeOpropAssertion(axiom);
                break;
            case exprTypes.FACT_SAME_INDIVIDUAL:
                owlXml += writeIndividualAssertion(axiom, 'SameIndividual');
                break;
            case exprTypes.FACT_DIFFERENT_INDIVIDUALS:
                owlXml += writeIndividualAssertion(axiom, 'DifferentIndividuals');
                break;
            default:
                throw 'Unknown type of the axiom!';
            }
        }
     
        owlXml += '</Ontology>';
        return owlXml;
    }  
};

/** Allows to work with SQL representation of queries against RDF data. */
jsw.owl.TrimQueryABox = function () {
    /** The object storing ABox data. */
    this.database = {
        ClassAssertion: [],
        ObjectPropertyAssertion: []
    };

    /** The object which can be used to send queries against ABoxes. */
    this.queryLang = this.createQueryLang();
};

/** Prototype for all jsw.TrimQueryABox objects. */
jsw.owl.TrimQueryABox.prototype = {
    /**
     * Answers the given RDF query.
     *
     * @param query RDF query to anwer.
     * @return Data set containing the results matching the query.
     */
    answerQuery: function (query) {
        var sql = this.createSql(query);
        
        try {
            return this.queryLang.parseSQL(sql).filter(this.database);
        } catch (ex) {
            // Recreate the query language object, since the previous object can not be used now.
            this.queryLang = this.createQueryLang();
            throw ex;
        }
    },

    /**
     * Adds a class assetion to the database.
     *
     * @param individualIri IRI of the inividual in the assertion.
     * @param classIri IRI of the class in the assertion.
     */
    addClassAssertion: function (individualIri, classIri) {
        this.database.ClassAssertion.push({
            individual: individualIri,
            className: classIri
        });
    },

    /**
     * Adds an object property assetion to the database.
     *
     * @param objectPropertyIri IRI of the object property in the assertion.
     * @param leftIndIri IRI of the left individual in the assertion.
     * @param rightIndIri IRI of the right individual in the assertion.
     */
    addObjectPropertyAssertion: function (objectPropertyIri, leftIndIri, rightIndIri) {
        this.database.ObjectPropertyAssertion.push({
            objectProperty: objectPropertyIri,
            leftIndividual: leftIndIri,
            rightIndividual: rightIndIri
        });
    },

    /**
     * Creates an object which can be used for sending queries against the database.
     *
     * @return Object which can be used for sending queries against the database.
     */
    createQueryLang: function () {
        return TrimPath.makeQueryLang({
            ClassAssertion          : { individual      : { type: 'String' },
                                        className       : { type: 'String' }},
            ObjectPropertyAssertion : { objectProperty  : { type: 'String' },
                                        leftIndividual  : { type: 'String' },
                                        rightIndividual : { type: 'String' }}
        });
    },

    /**
     * Returns an SQL representation of the given RDF query.
     *
     * @param query jsw.rdf.Query to return the SQL representation for.
     * @return SQL representation of the given RDF query.
     */
    createSql: function (query) {
        var from, limit, objectField, orderBy, predicate, predicateType, predicateValue, rdfTypeIri,
            select, subjectField, table, triple, triples, tripleCount, tripleIndex, exprTypes,
            variable, vars, varCount, varField, varFields, varIndex, where;

        from = '';
        where = '';
        rdfTypeIri = jsw.rdf.IRIs.TYPE;

        exprTypes = query.ExpressionTypes;
        varFields = {};

        /** Appends a condition to the where clause based on the given expression.
         *

         * @param expr Expression to use for constructing a condition.
         * @param table Name of the table corresponding to the expression.
         * @param field Name of the field corresponding to the expression.
         */
        function writeExprCondition(expr, table, field) {
            var type = expr.type,
                value = expr.value,
                varField;

            if (type === exprTypes.IRI_REF) {
                where += table + '.' + field + "=='" + value + "' AND ";
            } else if (type === exprTypes.VAR) {
                varField = varFields[value];

                if (varField) {
                    where += table + '.' + field + '==' + varField + ' AND ';
                } else {
                    varFields[value] = table + '.' + field;
                }
            } else if (type === exprTypes.LITERAL) {
                throw 'Literal expressions in RDF queries are not supported by the library yet!';
            } else {
                throw 'Unknown type of expression found in the RDF query: ' + type + '!';
            }
        }
        
        triples = query.triples;
        tripleCount = triples.length;

        for (tripleIndex = 0; tripleIndex < tripleCount; tripleIndex += 1) {
            triple = triples[tripleIndex];

            predicate = triple.predicate;
            predicateType = predicate.type;
            predicateValue = predicate.value;
            subjectField = 'leftIndividual';
            objectField = 'rightIndividual';
            table = 't' + tripleIndex;

            if (predicateType === exprTypes.IRI_REF) {
                if (predicateValue === rdfTypeIri) {
                    from += 'ClassAssertion AS ' + table + ', ';
                    subjectField = 'individual';
                    objectField = 'className';
                } else {
                    from += 'ObjectPropertyAssertion AS ' + table + ', ';
                    where += table + ".objectProperty=='" + predicateValue + "' AND ";
                }
            } else if (predicateType === exprTypes.VAR) {
                from += 'ObjectPropertyAssertion AS ' + table + ', ';
                varField = varFields[predicateValue];

                if (varField) {
                    where += table + '.objectProperty==' + varField + ' AND ';
                } else {
                    varFields[predicateValue] = table + '.objectProperty';
                }
            } else {
                throw 'Unknown type of a predicate expression: ' + predicateType + '!';
            }

            writeExprCondition(triple.subject, table, subjectField);
            writeExprCondition(triple.object, table, objectField);
        }

        if (tripleCount > 0) {
            from = ' FROM ' + from.substring(0, from.length - 2);
        }

        if (where.length > 0) {
            where = ' WHERE ' + where.substring(0, where.length - 5);
        }

        select = '';
        vars = query.variables;
        varCount = vars.length;

        if (varCount > 0) {
            for (varIndex = 0; varIndex < varCount; varIndex += 1) {
                variable = vars[varIndex].value;
                varField = varFields[variable];

                if (varField) {
                    select += varField + ' AS ' + variable + ', ';
                } else {
                    select += "'' AS " + variable + ', ';
                }
            }
        } else {
            for (variable in varFields) {
                if (varFields.hasOwnProperty(variable)) {
                    select += varFields[variable] + ' AS ' + variable + ', ';
                }
            }
        }

        if (select.length > 0) {
            select = select.substring(0, select.length - 2);
        } else {
            throw 'The given RDF query is in the wrong format!';
        } 

        if (query.distinctResults) {
            select = 'SELECT DISTINCT ' + select;
        } else {
            select = 'SELECT ' + select;
        }

        orderBy = '';
        vars = query.orderBy;
        varCount = vars.length;

        for (varIndex = 0; varIndex < varCount; varIndex += 1) {
            variable = vars[varIndex];

            if (variable.type !== exprTypes.VAR) {
                throw 'Unknown type of expression found in ORDER BY: ' + variable.type + '!';
            }

            orderBy += variable.value + ' ' + variable.order + ', ';
        }

        if (varCount > 0) {
            orderBy = ' ORDER BY ' + orderBy.substring(0, orderBy.length - 2);
        }

        limit = '';

        if (query.limit !== 0) {

            limit = ' LIMIT ';
            if (query.offset !== 0) {
                limit += query.offset + ', ';
            }
            limit += query.limit;
        } else if (query.offset !== 0) {
            limit = ' LIMIT ' + query.offset + ', ALL';
        }

        return select + from + where + orderBy + limit;
    }
};

/**
 * BrandT is an OWL-EL reasoner. Currently, it has some limitations and does not allow
 * reasoning on full EL++, but it does cover EL+ and its minor extensions.
 */
jsw.owl.BrandT = function (ontology) {  
    var clock, exprTypes, normalizedOntology, owlIris;
   
    owlIris = jsw.owl.IRIs;
    exprTypes = jsw.owl.ExpressionTypes;   
    
    /** Stores information about how much time different steps of building a reasoner took. */
    this.timeInfo = {};
    
    /** Original ontology from which the reasoner was built. */
    this.originalOntology = ontology;
   
    clock = new jsw.util.Stopwatch();

    clock.start();
    normalizedOntology = this.normalizeOntology(ontology);
    this.timeInfo.normalization = clock.stop();
   
    clock.start();
    this.objectPropertySubsumers = this.buildObjectPropertySubsumerSets(normalizedOntology);
    this.timeInfo.objectPropertySubsumption = clock.stop();

    clock.start();
    this.classSubsumers = this.buildClassSubsumerSets(normalizedOntology);
    this.timeInfo.classification = clock.stop();
   
    clock.start();
    /** Rewritten A-Box of the ontology. */
    this.aBox = this.rewriteAbox(normalizedOntology);
    this.timeInfo.aBoxRewriting = clock.stop();

    // Remove entity IRIs introduced during normalization stage from the subsumer sets. 
    this.removeIntroducedEntities(
        this.classSubsumers,
        ontology.getClasses(),
        [owlIris.THING, owlIris.NOTHING]
    );
    this.removeIntroducedEntities(
        this.objectPropertySubsumers,
        ontology.getObjectProperties(),
        [owlIris.TOP_OBJECT_PROPERTY, owlIris.BOTTOM_OBJECT_PROPERTY]
    );

    clock.start();
    /** Class hierarchy implied by the ontology. */
    this.classHierarchy = this.classSubsumers.buildHierarchy(this.getExplicitClassSubsumptions());
    this.timeInfo.classHierarchy = clock.stop();

    clock.start();
    /** Object property hierarchy implied by the ontology. */
    this.objectPropertyHierarchy = this.objectPropertySubsumers.buildHierarchy(
        this.getExplicitObjectPropertySubsumptions()
    );
    this.timeInfo.objectPropertyHierarchy = clock.stop();
};

/** Prototype for all BrandT objects. */
jsw.owl.BrandT.prototype = {
    /**
     * Builds an object property subsumption relation implied by the ontology.
     * 
     * @param ontology Normalized ontology to be use for building the subsumption relation. 
     * @return 2-tuple storage hashing the object property subsumption relation implied by the 
     * ontology.
     */
    buildObjectPropertySubsumerSets: function (ontology) {
        var args, axiom, axioms, axiomIndex, exprTypes, objectProperties, objectProperty, 
            objectPropertySubsumers, opropType, reqAxiomType, queue, subsumer, subsumers,
            topObjectProperty;
      
        topObjectProperty = jsw.owl.IRIs.TOP_OBJECT_PROPERTY;
        objectPropertySubsumers = new jsw.util.PairStorage();
        
        objectPropertySubsumers.add(topObjectProperty, topObjectProperty);
        
        objectProperties = ontology.getObjectProperties();

        for (objectProperty in objectProperties) {
            if (objectProperties.hasOwnProperty(objectProperty)) {
                // Every object property is a subsumer for itself.
                objectPropertySubsumers.add(objectProperty, objectProperty);
                // Top object property is a subsumer for every other property.
                objectPropertySubsumers.add(objectProperty, topObjectProperty);
            }
        }
      
        axioms = ontology.axioms;

        exprTypes = jsw.owl.ExpressionTypes;
        opropType = exprTypes.ET_OPROP;
        reqAxiomType = exprTypes.AXIOM_OPROP_SUB;

        // Add object property subsumptions explicitly mentioned in the ontology.
        for (axiomIndex = axioms.length; axiomIndex--;) {
            axiom = axioms[axiomIndex];
            args = axiom.args;
        
            if (axiom.type !== reqAxiomType || args[0].type !== opropType) {
                continue;
            }
         
            objectPropertySubsumers.add(args[0].IRI, args[1].IRI);
        }

        queue = new jsw.util.Queue();

        for (objectProperty in objectProperties) {
            if (!objectProperties.hasOwnProperty(objectProperty)) {
                continue;
            }
        
            subsumers = objectPropertySubsumers.get(objectProperty);
        
            for (subsumer in subsumers) {
                if (subsumers.hasOwnProperty(subsumer)) {
                    queue.enqueue(subsumer);
                }
            }
         
            // Discover implicit subsumptions via intermediate object properties.
            while (!queue.isEmpty()) {
                subsumers = objectPropertySubsumers.get(queue.dequeue());
                
                for (subsumer in subsumers) {
                    if (subsumers.hasOwnProperty(subsumer)) {
                        // If the objectProperty has subsumer added in its subsumer set, then that
                        // subsumer either was processed already or has been added to the queue - no
                        // need to process it for the second time.
                        if (!objectPropertySubsumers.exists(objectProperty, subsumer)) {
                            objectPropertySubsumers.add(objectProperty, subsumer);
                            queue.enqueue(subsumer);
                        }
                    }
                }
            }
        }
      
        return objectPropertySubsumers;
    },

    /**
     * Builds a class subsumption relation implied by the ontology.
     * 
     * @param ontology Ontology to use for building subsumer sets. The ontology has to be
     * normalized.
     * @return 2-tuple storage containing the class subsumption relation implied by the ontology.
     */
    buildClassSubsumerSets: function (ontology) {
        var a,
            labelNodeIfAxioms1 = [],
            labelNodeIfAxioms2 = [],
            labelNodeAxioms = [],
            labelEdgeAxioms = [],
            labelNodeIfAxiom1Count,
            labelNodeIfAxiom2Count,
            labelNodeAxiomCount,
            labelEdgeAxiomCount,
            b,
            // Provides quick access to axioms like r o s <= q.
            chainSubsumers = this.buildChainSubsumerSets(ontology),     
            // Stores labels for each node.
            classSubsumers = new jsw.util.PairStorage(),
            // Stores labels for each edge.
            edgeLabels = new jsw.util.TripleStorage(),
            instruction,
            leftChainSubsumers = chainSubsumers.left,
            node,
            nothing = jsw.owl.IRIs.NOTHING,
            objectPropertySubsumers = this.objectPropertySubsumers,
            originalOntology = this.originalOntology,
            queue,
            queues = {},
            rightChainSubsumers = chainSubsumers.right,
            p,
            someInstructionFound;
      
        /**
         * Splits the axiom set of the ontology into several subsets used for different purposes.
         */
        function splitAxiomSet() {
            var axiom, axioms, axiomIndex, axiomType, classType, exprTypes, firstArgType,
                intersectType, reqAxiomType, secondArgType, someValuesType;
            
            exprTypes = jsw.owl.ExpressionTypes;
            reqAxiomType = exprTypes.AXIOM_CLASS_SUB;
            classType = exprTypes.ET_CLASS;
            intersectType = exprTypes.CE_INTERSECT;
            someValuesType = exprTypes.CE_OBJ_VALUES_FROM;
            axioms = ontology.axioms;
            
            for (axiomIndex = axioms.length; axiomIndex--;) {
                axiom = axioms[axiomIndex];
                axiomType = axiom.type;
   
                if (axiom.type !== reqAxiomType) {
                    continue;
                }   
   
                secondArgType = axiom.args[1].type;
   
                if (secondArgType === classType) {
                    firstArgType = axiom.args[0].type;
                    
                    if (firstArgType === classType) {
                        labelNodeIfAxioms1.push(axiom);
                    } else if (firstArgType === intersectType) {
                        labelNodeIfAxioms2.push(axiom);
                    } else if (firstArgType === someValuesType) {
                        labelNodeAxioms.push(axiom);
                    }
                } else if (secondArgType === someValuesType) {
                    if (axiom.args[0].type === classType) {
                        labelEdgeAxioms.push(axiom);
                    }
                }
            }
            
            labelNodeAxiomCount = labelNodeAxioms.length;
            labelNodeIfAxiom1Count = labelNodeIfAxioms1.length;
            labelNodeIfAxiom2Count = labelNodeIfAxioms2.length;
            labelEdgeAxiomCount = labelEdgeAxioms.length;
        }
      
        /**
         * Adds instructions 
         * 
         * 'Label B as C if it is labeled A1, A2, ..., Am already' 
         * 
         * to the queue of B for all axioms like
         * 
         * A1 n A2 n ... n A n ... n Am <= C.
         * 
         * @param A IRI of the class to look for in the left part of axioms.
         * @param B IRI of the class to add instructions to.
         */
        function addLabelNodeIfInstructions(a, b) {
            var axioms, args, axiomIndex, canUse, classes, classCount, classIndex, classIri,
                reqLabels;
            
            axioms = labelNodeIfAxioms1;        

            for (axiomIndex = labelNodeIfAxiom1Count; axiomIndex--;) {
                args = axioms[axiomIndex].args;
                
                if (args[0].IRI === a) {
                    queues[b].enqueue({
                        'type': 0, 
                        'node': b,
                        'label': args[1].IRI, 
                        'reqLabels': null
                    });
                }
            }
            
            axioms = labelNodeIfAxioms2;
            
            for (axiomIndex = labelNodeIfAxiom2Count; axiomIndex--;) {
                args = axioms[axiomIndex].args;
                classes = args[0].args;
                classCount = classes.length;
                canUse = false;
            
                for (classIndex = classCount; classIndex--;) {
                    if (classes[classIndex].IRI === a) {
                        canUse = true;
                        break;
                    }
                }
                
                if (!canUse) {
                    // Axiom does not contain A on the left side
                    continue;
                }
                
                reqLabels = {};
                    
                for (classIndex = classCount; classIndex--;) {
                    classIri = classes[classIndex].IRI;
                  
                    if (classIri !== a) {
                        reqLabels[classIri] = true;
                    }
                }
                
                queues[b].enqueue({
                    'type': 0, 
                    'node': b,
                    'label': args[1].IRI, 
                    'reqLabels': reqLabels
                });
            }
        }
              
        /**
         * Adds instructions 
         * 
         * 'Label B with C' 
         * 
         * to the queue of B for all axioms like
         * 
         * E P.A <= C.
         * 
         * @param p IRI of the object property to look for in axioms.
         * @param a IRI of the class to look for in the left part of axioms.
         * @param b IRI of the class to add instructions to.
         */
        function addLabelNodeInstructions(p, a, b) {
            var axioms, args, axiomIndex, firstArg;

            axioms = labelNodeAxioms;
        
            for (axiomIndex = labelNodeAxiomCount; axiomIndex--;) {
                args = axioms[axiomIndex].args;
                firstArg = args[0];
                
                if (firstArg.opropExpr.IRI === p && firstArg.classExpr.IRI === a) {
                    queues[b].enqueue({
                        'type': 0,
                        'node': b,
                        'label': args[1].IRI
                    });
                }
            }
        }
      
        /**
         * Adds instructions 
         * 
         * 'Label the edge (B, C) as P' 
         * 
         * to the queue of B for all axioms like
         * 
         * A <= E P.C
         * 
         * @param A IRI of the class to look for in the left part of axioms.
         * @param B IRI of the class to add instructions to.
         */
        function addLabelEdgeInstructions(a, b) {
            var axioms, args, axiomIndex, secondArg;

            axioms = labelEdgeAxioms;

            for (axiomIndex = labelEdgeAxiomCount; axiomIndex--;) {
                args = axioms[axiomIndex].args;
                secondArg = args[1];
         
                if (args[0].IRI !== a) {
                    continue;
                }
            
                queues[b].enqueue({
                    'type': 1,
                    'node1': b, // IRI of the source node of the edge.
                    'node2': secondArg.classExpr.IRI, // IRI of the destination node of the edge.
                    'label': secondArg.opropExpr.IRI // IRI of the label to add to the edge.
                });
            }
        }
      
        /**
         * Adds instructions to the queue of class B for axioms involving class A.
         * 
         * @param a IRI of the class to look for in axioms.
         * @param b IRI of the class to add instructions for.
         */
        function addInstructions(a, b) {
            addLabelNodeIfInstructions(a, b);
            addLabelEdgeInstructions(a, b);
        }
      
        /**
         * Initialises a single node of the graph before the subsumption algorithm is run.
         *
         * @param classIri IRI of the class to initialize a node for.
         */
        function initialiseNode(classIri) {
            // Every class is a subsumer for itself.
            classSubsumers.add(classIri, classIri);
         
            // Initialise an instruction queue for the node.
            queues[classIri] = new jsw.util.Queue();
         
            // Add any initial instructions about the class to the queue.
            addInstructions(classIri, classIri);
        }
      
        /**
         * Initialises data structures before the subsumption algorithm is run.
         */
        function initialise() {
            var classes = ontology.getClasses(),
                classIri,
                thing = jsw.owl.IRIs.THING;
            
            // Put different axioms into different 'baskets'.
            splitAxiomSet();
            
            // Create a node for Thing (superclass).
            initialiseNode(thing);
         
            for (classIri in classes) {
                if (classes.hasOwnProperty(classIri) && !classes[classIri]) {
                    // Create a node for each class in the Ontology.
                    initialiseNode(classIri);
            
                    // Mark Thing as a subsumer of the class.
                    classSubsumers.add(classIri, thing);   
   
                    // All axioms about Thing should also be true for any class.
                    addInstructions(thing, classIri);
                }
            }
        }

        /**
         * Adds subsumers sets for classes which have not been found in the TBox of the ontology.
         */
        function addRemainingSubsumerSets() {
            var classes = ontology.getClasses(),
                classIri,
                nothing = jsw.owl.IRIs.NOTHING,
                originalClasses = originalOntology.getClasses(),
                thing = jsw.owl.IRIs.THING;
           
            // We add Nothing to the subsumer sets only if some of the original classes has Nothing
            // as a subsumer.
            for (classIri in classSubsumers.get()) {
                if (originalClasses.hasOwnProperty(classIri) &&
                        classSubsumers.exists(classIri, nothing)) {
                    // In principle, everything is a subsumer of Nothing, but we ignore it.
                    classSubsumers.add(nothing, nothing);
                    classSubsumers.add(nothing, thing);
                    break;
                }
            }

            for (classIri in ontology.getClasses()) {
                if (classes.hasOwnProperty(classIri) && classes[classIri]) {
                    classSubsumers.add(classIri, classIri);
                    classSubsumers.add(classIri, thing);
                }
            }
        }

        /**
         * Processes an instruction to add a new edge.
         *
         * @param node1 The source node of the edge.
         * @param node2 The destination node of the edge.
         * @param label Label to use for the edge.
         */
        function processNewEdge(a, b, p) {
            var bSubsumers, c, classes, edges, lChainSubsumers, q, r, rChainSubsumers, s;

            classes = classSubsumers.get();
            edges = edgeLabels;
            bSubsumers = classSubsumers.get(b);
            lChainSubsumers = leftChainSubsumers;
            rChainSubsumers = rightChainSubsumers;

            // For all subsumers of object property P, including P itself.
            for (q in objectPropertySubsumers.get(p)) {  
                // Add q as a label between A and B.
                edges.add(a, b, q);
         
                // Since we discovered that A <= E Q.B, we know that A <= E Q.C, where C is any
                // subsumer of B. We therefore need to look for new subsumers D of A by checking
                // all axioms like E Q.C <= D.
                for (c in bSubsumers) {
                    addLabelNodeInstructions(q, c, a);
                }
               
                // We want to take care of object property chains. We now know that Q: A -> B.
                // If there is another property R: C -> A for some class C and property S, such that
                // R o Q <= S, we want to label edge (C, B) with S.
                for (r in rChainSubsumers.get(q)) {
                    for (s in rChainSubsumers.get(q, r)) {
                        for (c in classes) {
                            if (edges.exists(c, a, r) && !edges.exists(c, b, s)) {
                                processNewEdge(c, b, s);
                            }
                        }
                    }
                }
            
                // We want to take care of object property chains. We now know that Q: A -> B. 
                // If there is another property R: B -> C for some class C and property S, such that
                // Q o R <= S, we want to label edge (A, C) with S.
                for (r in lChainSubsumers.get(q)) {
                    for (s in lChainSubsumers.get(q, r)) {
                        for (c in classes) {
                            if (edges.exists(b, c, r) && !edges.exists(a, c, s)) {
                                processNewEdge(a, c, s);
                            }
                        }
                    }
                }
            }
        }

        /**
         * Processes the given Label Edge instruction.
         *
         * @param instruction Label Edge instruction to process.
         */
        function processLabelEdgeInstruction(instruction) {
            var p = instruction.label,
                a = instruction.node1,  
                b = instruction.node2;

            // If the label exists already, no need to process the instruction.
            if (!edgeLabels.exists(a, b, p)) {
                processNewEdge(a, b, p);
            }
        }
    
        /**
         * Processes the given Label Node instruction.
         *
         * @param instruction Label Node instruction to process.
         */
        function processLabelNodeInstruction(instruction) { 
            var a, b, c, edges, p, subsumers;

            a = instruction.node;
            b = instruction.label;
            edges = edgeLabels;
            subsumers = classSubsumers;
                       
            if (subsumers.exists(a, b) || !subsumers.existAll(a, instruction.reqLabels)) {
                // The node is not labeled with all required labels yet or it has been labeled
                // with the new label already - there is no point to process the operation anyway.
                return;
            }
         
            // Otherwise, add a label to the node. 
            subsumers.add(a, b);
         
            // Since B is a new discovered subsumer of A, all axioms about B apply to A as well - 
            // we need to update node instruction queue accordingly.
            addInstructions(b, a);
         
            // We have discovered a new information about A, so we need to update all other nodes
            // linked to it.
            for (c in edges.get()) {
                for (p in edges.get(c, a)) {
                    // For all C <= E P.A, we now know that C <= E P.B. And therefore C should have
                    // the same subsumers as E P.B.
                    addLabelNodeInstructions(p, b, c);
                }
            }
        }
      
        // Initialise queues and labels.
        initialise();
      
        do { 
            someInstructionFound = false;
         
            // Get a queue which is not empty.
            for (node in queues) {

                queue = queues[node];
            
                if (!queue.isEmpty()) {
                    // Process the oldest instruction in the queue.
                    instruction = queue.dequeue();

                    switch (instruction.type) {
                    case 0:
                        processLabelNodeInstruction(instruction);
                        break;
                    case 1:
                        processLabelEdgeInstruction(instruction);
                        break;
                    default:
                        throw 'Unrecognized type of instruction found in the queue!';
                    }

                    someInstructionFound = true;
                    break;
                }
            }
        } while (someInstructionFound);
      
        do {
            someInstructionFound = false;
            
            for (a in edgeLabels.get()) {
                if (classSubsumers.exists(a, nothing)) {
                    continue;
                }
                
                for (b in edgeLabels.get(a)) {
                    for (p in edgeLabels.get(a, b)) {
                        if (classSubsumers.exists(b, nothing)) {
                            classSubsumers.add(a, nothing);
                        }
                    }
                }
            }
        } while (someInstructionFound);

        // Add a subsumer set for every class which did not participate in TBox.
        addRemainingSubsumerSets();

        return classSubsumers;
    },

    /**
     * Removes from subsumer sets references to entities which have been introduced during
     * normalization stage. 
     * 
     * @param subsumerSets Subsumer sets to remove the introduced entities from.
     * @param originalEntities Object containing IRIs of original entities as properties.
     * @param allowedEntities Array containing names of entites which should not be removed if they
     * are present in the subsumer sets.
     */
    removeIntroducedEntities: function (subsumerSets, originalEntities, allowedEntities) {
        var allowedCount = allowedEntities.length,
            entityIri,
            subsumerIri;
        
        /**
         * Checks if the given given entity IRI has been introduced during normalization stage.
         * 
         * @param entityIri IRI of the entity to check.
         * @return True if the entity has been introduced, false otherwise.
         */
        function isIntroducedEntity(entityIri) {
            var index;
            
            if (originalEntities.hasOwnProperty(entityIri)) {
                return true;
            }
            
            for (index = allowedCount; index--;) {
                if (allowedEntities[index] === entityIri) {
                    return true;
                }
            }
        }
        
        // Remove introduced entities from subsumer sets.
        for (entityIri in subsumerSets.get()) {
            if (!isIntroducedEntity(entityIri)) {
                subsumerSets.remove(entityIri);
                continue;
            }
            
            for (subsumerIri in subsumerSets.get(entityIri)) {
                if (!isIntroducedEntity(subsumerIri)) {
                    subsumerSets.remove(entityIri, subsumerIri);
                }
            }
        }
    },

    /**
     * Creates an object which hashes axioms like r o s <= q, so that all axioms related to either
     * q or s can be obtained efficiently.
     * 
     * @param ontology Normalized ontology containing the axioms to hash.
     * @return Object hashing all object property chain subsumptions.
     */
    buildChainSubsumerSets: function (ontology) {
        var args, axiom, axioms, axiomIndex, chainSubsumer, exprTypes, leftSubsumers, leftOprop,
            opropChainType, reqAxiomType, rightOprop, rightSubsumers;
      
        axioms = ontology.axioms;
        
        leftSubsumers = new jsw.util.TripleStorage();
        rightSubsumers = new jsw.util.TripleStorage();

        exprTypes = jsw.owl.ExpressionTypes;
        reqAxiomType = exprTypes.AXIOM_OPROP_SUB;
        opropChainType = exprTypes.OPE_CHAIN;

        for (axiomIndex = axioms.length; axiomIndex--;) {
            axiom = axioms[axiomIndex];
               
	        if (axiom.type !== reqAxiomType || axiom.args[0].type !== opropChainType) {
                continue;
	        }
               
            args = axiom.args[0].args;
	        leftOprop = args[0].IRI;
	        rightOprop = args[1].IRI;
	        chainSubsumer = axiom.args[1].IRI;
         
            leftSubsumers.add(leftOprop, rightOprop, chainSubsumer);
            rightSubsumers.add(rightOprop, leftOprop, chainSubsumer);
        }
      
        return {
            'left': leftSubsumers,
            'right': rightSubsumers
        };
    },

    /**
     * Returns a PairStorage containing the explicit object property subsumptions present in the
     * ontology.
     *
     * @return PairStorage containing an explicit object property subsumptions present in the
     * ontology.
     */
    getExplicitObjectPropertySubsumptions: function () {
        var arg1, args, axiom, axioms, axiomIndex, axiomType, exprTypes, opropType, storage;

        axioms = this.originalOntology.axioms;
        storage = new jsw.util.PairStorage();

        exprTypes = jsw.owl.ExpressionTypes;
        axiomType = exprTypes.AXIOM_OPROP_SUB;
        opropType = exprTypes.ET_OPROP;

        for (axiomIndex = axioms.length; axiomIndex--;) {
            axiom = axioms[axiomIndex]; 

            if (axiom.type !== axiomType) {
                continue;
            }

            args = axiom.args;
            arg1 = args[0];
            
            if (arg1.type === opropType) {
                storage.add(arg1.IRI, args[1].IRI);
            }
        }
        
        return storage;
    },

    /**
     * Returns a PairStorage containing the explicit class subsumptions present in the ontology.
     *
     * @return PairStorage containing an explicit class subsumption relation present in the
     * ontology.
     */
    getExplicitClassSubsumptions: function () {
        var axiom, axiomArgs, axiomIndex, axiomEqType, axiomSubType, axioms, classIri, classType,
            expr, exprArgs, exprArgIndex, exprType, exprTypes, reqExprType, stack, storage;

        axioms = this.originalOntology.axioms;
        storage = new jsw.util.PairStorage();
        exprTypes = jsw.owl.ExpressionTypes;
        axiomEqType = exprTypes.AXIOM_CLASS_EQ;
        axiomSubType = exprTypes.AXIOM_CLASS_SUB;
        classType = exprTypes.ET_CLASS;
        reqExprType = exprTypes.CE_INTERSECT;

        for (axiomIndex = axioms.length; axiomIndex--;) {
            axiom = axioms[axiomIndex]; 
            axiomArgs = axiom.args;

            if ((axiom.type !== axiomSubType && axiom.type !== axiomEqType) ||
                    axiomArgs[0].type !== classType) {
                continue;
            }

            classIri = axiomArgs[0].IRI;

            // We need to use stack for processing nested object intersection expressions.
            stack = [axiomArgs[1]];

            while (stack.length > 0) {
                expr = stack.pop();
                exprType = expr.type;
                
                if (exprType === classType) {
                    storage.add(classIri, expr.IRI);
                } else if (exprType === reqExprType) {
                    exprArgs = expr.args;

                    for (exprArgIndex = exprArgs.length; exprArgIndex--;) {
                        stack.push(exprArgs[exprArgIndex]);
                    }
                }
            }
        }
        
        return storage;
    },

    /**
     * Rewrites an ABox of the ontology into the relational database to use it for conjunctive query
     * answering. 
     * 
     * @param ontology Normalized ontology containing the ABox to rewrite.
     * @return An object containing the rewritten ABox.
     */
    rewriteAbox: function (ontology) {
        var axioms = ontology.axioms,
            axiomCount = axioms.length,
            classSubsumers = this.classSubsumers,
            aBox = new jsw.owl.TrimQueryABox(),
            exprTypes = jsw.owl.ExpressionTypes,
            objectPropertySubsumers = this.objectPropertySubsumers,
            originalOntology = this.originalOntology;
      
        /**
         * Puts class assertions implied by the ontology into the database.
         * 
         * @return Array containing all class assertions implied by the ontology. 
         */
        function rewriteClassAssertions() {
            var axiom, axiomIndex, classFactType, classIri, individualClasses, individualIri,
                subsumerIri;

            individualClasses = new jsw.util.PairStorage();
            classFactType = exprTypes.FACT_CLASS;

            for (axiomIndex = axiomCount; axiomIndex--;) {
                axiom = axioms[axiomIndex];
         
                if (axiom.type !== classFactType) {
                    continue;
                }
            
                individualIri = axiom.individual.IRI;
                classIri = axiom.classExpr.IRI;
            
                for (subsumerIri in classSubsumers.get(classIri)) {
                    if (originalOntology.containsClass(subsumerIri)) {
                        individualClasses.add(individualIri, subsumerIri);
                    }
                }
            }

            // Put class assertions into the database.
            for (individualIri in individualClasses.get()) {
                for (classIri in individualClasses.get(individualIri)) {
                    aBox.addClassAssertion(individualIri, classIri);
                }
            }
        }
      
        /** 
         * Puts role assertions implied by the ontology into the database.
         *
         * @return Array containing all object property assertions implied by the ontology.
         */
        function rewriteObjectPropertyAssertions() {
            var args, axiom, axiomIndex, centerInd, chainSubsumer, changesHappened, individual,
                individuals, opropSubsumer, leftInd, leftOprop, oprop, opropFactType,
                reflexiveOpropType, reqAxiomType, reqExprType, rightInd, rightOprop, storage;

            storage = new jsw.util.TripleStorage();
            reflexiveOpropType = exprTypes.AXIOM_OPROP_REFL;
            opropFactType = exprTypes.FACT_OPROP;
            individuals = originalOntology.getIndividuals();

            for (axiomIndex = axiomCount; axiomIndex--;) {
                axiom = axioms[axiomIndex];

                // Reflexive object properties.         
                if (axiom.type === reflexiveOpropType) {
                    for (opropSubsumer in objectPropertySubsumers.get(axiom.objectProperty.IRI)) {
                        for (individual in individuals) {
                            storage.add(opropSubsumer, individual, individual);
                        }
                    }
                } else if (axiom.type === opropFactType) {
                    leftInd = axiom.leftIndividual.IRI;
                    rightInd = axiom.rightIndividual.IRI;
            
                    for (opropSubsumer in objectPropertySubsumers.get(axiom.objectProperty.IRI)) {
                        storage.add(opropSubsumer, leftInd, rightInd);
                    }
                }
            }
         
            reqAxiomType = exprTypes.AXIOM_OPROP_SUB;
            reqExprType = exprTypes.OPE_CHAIN;

            do {
                changesHappened = false;
            
                for (axiomIndex = axiomCount; axiomIndex--;) {
                    axiom = ontology.axioms[axiomIndex];
               
                    if (axiom.type !== reqAxiomType || axiom.args[0].type !== reqExprType) {
                        continue;
                    }
               
                    args = axiom.args[0].args;
                    leftOprop = args[0].IRI;
                    rightOprop = args[1].IRI;
                    chainSubsumer = axiom.args[1].IRI;
               
                    for (leftInd in storage.get(leftOprop)) {
                        for (centerInd in storage.get(leftOprop, leftInd)) {
                            for (rightInd in storage.get(rightOprop, centerInd)) {
                                for (opropSubsumer in objectPropertySubsumers.get(chainSubsumer)) {
                                    if (!storage.exists(opropSubsumer, leftInd, rightInd)) {
	                                    storage.add(opropSubsumer, leftInd, rightInd);
	                                    changesHappened = true;
	                                }
                                }
                            }
                        }
	                }
                }
            } while (changesHappened);

            // Put object property assertions into the database.
            for (oprop in storage.get()) {
                if (!originalOntology.containsObjectProperty(oprop)) {
                    continue;
                }
            
                for (leftInd in storage.get(oprop)) {
                    for (rightInd in storage.get(oprop, leftInd)) {
                        aBox.addObjectPropertyAssertion(oprop, leftInd, rightInd);
                    }
                }
            }
        }

        rewriteClassAssertions();
        rewriteObjectPropertyAssertions();        

        return aBox;
    },
   
    /**
     * Answers the given user query. 
     * 
     * @param query An object representing a query to be answered.
     * @return True if the ontology satisfies the query, false otherwise.
     */
    answerQuery: function (query) {
        if (!query) {
            throw 'The query is not specified!'; 
        }

        return this.aBox.answerQuery(query);
    },
    
    /**
     * Checks whether the class with the given IRI is satisfiable.
     * 
     * @param classIri IRI of the class to check.
     */
    isClassSatisfiable: function (classIri) {
        return !this.classSubsumers.exists(classIri, jsw.owl.IRIs.NOTHING);
    },
    
    /**
     * Checks whether the subsumption relationship between two given classes exists.
     * 
     * @param classIri1 IRI of the subsumee class.
     * @param classIri2 IRI of the subsumer class.
     * @return True if the subsumption between the two classes exists, false otherwise. 
     */
    isSubClassOf: function (classIri1, classIri2) {
        return this.classSubsumers.exists(classIri1, classIri2);
    },
   
    /**
     * Checks whether the subsumption relationship between two given object properties exists.
     * 
     * @param objectPropertyIri1 IRI of the subsumee object property.
     * @param objectPropertyIri2 IRI of the subsumer object property.
     * @return True if the subsumption between the two object properties exists, false otherwise.
     */
    isSubObjectPropertyOf: function (objectPropertyIri1, objectPropertyIri2) {
        return this.objectPropertySubsumers.exists(objectPropertyIri1, objectPropertyIri2);
    },
   
    /**
     * Normalizes the given ontology.
     * 
     * @return New ontology which is a normalized version of the given one.
     */
    normalizeOntology: function (ontology) {  
        var axiom, axiomIndex, queue, exprTypes, nothingClass, resultAxioms, resultOntology,
            rules, ruleCount, ruleIndex, instanceClasses;
      
        /**
         * Copies all entities from the source ontology to the result ontology.
         */
        function copyEntities() {
            var entities, entitiesOfType, entityIri, entityType;
    
            entities = ontology.entities;

            for (entityType in entities) {
                if (entities.hasOwnProperty(entityType)) {
                    entitiesOfType = entities[entityType];
         
                    for (entityIri in entitiesOfType) {
                        if (entitiesOfType.hasOwnProperty(entityIri)) {
                            resultOntology.entities[entityType][entityIri] = 
                                entitiesOfType[entityIri];
                        }
                    }
                }
            }
        }

        /**
         * Creates a new entity of the given type with a unique IRI and registers it in the result
         * ontology.
         *
         * @param type Type of the entity to create.
         * @return Object representing the entity created.
         */
        function createEntity(type) {
            var newIri = resultOntology.createUniqueIRI(type);
            
            resultOntology.registerEntity(type, newIri);
            
            return {
                'type': type,
                'IRI': newIri
            };
        }
        
        /**
         * Returns nominal class object representing the given individual. If the class object
         * has not been created for the given individual, creates it.
         *
         * @param individual Object representing individual to return the nominal class for.
         * @return Nominal class object for the given individual.
         */
        function getIndividualClass(individual) {
            var individualIri, newClass;

            individualIri = individual.IRI;
            newClass = instanceClasses[individualIri];

            if (!newClass) {
                newClass = createEntity(exprTypes.ET_CLASS);
                instanceClasses[individualIri] = newClass;
            }

            return newClass;
        }
        
        /**
         * For the given DisjointClasses axiom involving class expressions A1 .. An,  puts an
         * equivalent set of axioms Ai n Aj <= {}, for all i <> j to the queue.
         *
         * @param statement DisjointClasses statement.
         * @param queue Queue to which the equivalent statements should be put. 
         */
        function replaceDisjointClassesAxiom(statement, queue) {
            var args, argIndex1, argIndex2, firstArg, intersectType, normalized, nothing,
                resultAxiomType;
                
            resultAxiomType = exprTypes.AXIOM_CLASS_SUB;
            intersectType = exprTypes.CE_INTERSECT;
            nothing = nothingClass;
            args = statement.args;
            normalized = [];
         
            for (argIndex1 = args.length; argIndex1--;) {
                firstArg = args[argIndex1];
                    
                for (argIndex2 = argIndex1; argIndex2--;) {
                    queue.enqueue({
                        'type': resultAxiomType,
                        'args': [{
                            'type': intersectType,
                            'args': [firstArg, args[argIndex2]]
                        }, nothing]
                    });
                }
            }
        }

        /**
         * For the given EquivalentClasses or EquivalentObjectProperties axiom involving expressions
         * A1 .. An,  puts an equivalent set of all axioms Ai <= Aj to the given queue.
         *
         * @param axiom EquivalentClasses or EquivalentObjectProperties axiom.
         * @param resultAxiomType Type of the result axioms.
         * @param queue Queue to which the equivalent statements should be put. 
         */
        function replaceEquivalenceAxiom(axiom, resultAxiomType, queue) {
            var args, argCount, argIndex1, argIndex2, firstArg;
                
            args = axiom.args;
            argCount = args.length;
         
            for (argIndex1 = argCount; argIndex1--;) {
                firstArg = args[argIndex1];
                    
                for (argIndex2 = argCount; argIndex2--;) {
                    if (argIndex1 !== argIndex2) {
                        queue.enqueue({
                            type: resultAxiomType,
                            args: [firstArg, args[argIndex2]]
                        });
                    }
                }
            }
        }

        /**
         * For the given TransitiveObjectProperty for object property r, adds an equivalent axiom
         * r o r <= r to the given queue.
         *
         * @param axiom TransitiveObjectProperty axiom.
         * @param queue Queue to which the equivalent statements should be put. 
         */
        function replaceTransitiveObjectPropertyAxiom(axiom, queue) {
            var oprop = axiom.objectProperty;
        
            queue.enqueue({
                'type': exprTypes.AXIOM_OPROP_SUB,
                'args': [{
                    'type': exprTypes.OPE_CHAIN,
                    'args': [oprop, oprop]
                }, oprop]
            });
        }

        /**
         * For the given ClassAssertion statement in the form a <= A, where a is
         * individual and A is a class expression, puts the new statements a <= B and B <= A,
         * where B is a new atomic class, to the queue.
         *
         * @param statement ClassAssertion statement.
         * @param queue Queue to which the equivalent statements should be put.
         */
        function replaceClassAssertion(statement, queue) {
            var individual, newClass;
         
            individual = statement.individual;
            newClass = getIndividualClass(individual);
         
            queue.enqueue({
                'type': exprTypes.AXIOM_CLASS_SUB,
                'args': [newClass, statement.classExpr]
            });
            queue.enqueue({
                'type': exprTypes.FACT_CLASS,
                'individual': individual,
                'classExpr': newClass
            });
        }

        /**
         * For the given ObjectPropertyAssertion statement in the form r(a, b), where a and b are
         * individuals and r is an object property, adds axioms A <= E r.B to the given queue, where
         * A and B represent nominals {a} and {b}.
         * 
         * @param statement ObjectPropertyAssertion statement.
         * @param queue Queue to which the equivalent statements should be put.
         */
        function replaceObjectPropertyAssertion(statement, queue) {
            queue.enqueue(statement);           
            queue.enqueue({
                'type': exprTypes.AXIOM_CLASS_SUB,
                'args': [getIndividualClass(statement.leftIndividual), {
                    'type': exprTypes.CE_OBJ_VALUES_FROM,
                    'opropExpr': statement.objectProperty,
                    'classExpr': getIndividualClass(statement.rightIndividual)
                }]
            });
        }

        /**
         * Returns a queue with axioms which need to be normalized.
         */
        function createAxiomQueue() {
            var axiom, axioms, axiomIndex, classAssertion, disjointClasses, equivalentClasses,
                equivalentObjectProperties, objectPropertyAssertion, queue, subClassOf,
                subObjPropertyOf, transitiveObjectProperty;
            
            disjointClasses = exprTypes.AXIOM_CLASS_DISJOINT;
            equivalentClasses = exprTypes.AXIOM_CLASS_EQ;
            equivalentObjectProperties = exprTypes.AXIOM_OPROP_EQ;
            subObjPropertyOf = exprTypes.AXIOM_OPROP_SUB;
            subClassOf = exprTypes.AXIOM_CLASS_SUB;
            transitiveObjectProperty = exprTypes.AXIOM_OPROP_TRAN;
            classAssertion = exprTypes.FACT_CLASS;
            objectPropertyAssertion = exprTypes.FACT_OPROP;
            queue = new jsw.util.Queue();
            axioms = ontology.axioms;
            
            for (axiomIndex = axioms.length; axiomIndex--;) {
                axiom = axioms[axiomIndex];
                
                switch (axiom.type) {
                case disjointClasses:
                    replaceDisjointClassesAxiom(axiom, queue);
                    break;
                case equivalentClasses:
                    replaceEquivalenceAxiom(axiom, subClassOf, queue);
                    break;
                case equivalentObjectProperties:
                    replaceEquivalenceAxiom(axiom, subObjPropertyOf, queue);
                    break;
                case transitiveObjectProperty:
                    replaceTransitiveObjectPropertyAxiom(axiom, queue);
                    break;
                case classAssertion: 
                    replaceClassAssertion(axiom, queue);
                    break;
                case objectPropertyAssertion:
                    replaceObjectPropertyAssertion(axiom, queue);
                    break;
                default:
                    queue.enqueue(axiom);
                }
            }
            
            return queue;
        }
        
        exprTypes = jsw.owl.ExpressionTypes;
        resultOntology = new jsw.owl.Ontology();
        instanceClasses = {};
        nothingClass = {
            'type': exprTypes.ET_CLASS,
            'IRI': jsw.owl.IRIs.NOTHING
        };

        rules = [
            /**
             * Checks if the given axiom is in the form P1 o P2 o ... o Pn <=  P, where Pi and P are
             * object property expressions. If this is the case, transforms it into the set of 
             * equivalent axioms
             *  
             *  P1 o P2 <= U1
             *  U1 o P3 <= U2
             *  ...
             *  Un-2 o Pn <= P,
             * 
             * where Ui are the new object properties introduced.
             * 
             * @param axiom Axiom to apply the rule to.
             * @return Set of axioms which are result of applying the rule to the given axiom or 
             * null if the rule could not be applied.
             */
            function (axiom) {
                var lastOpropIndex, newOprop, normalized, opropChainType, opropIndex, opropType,
                    prevOprop, reqAxiomType, srcChain;
         
                opropChainType = exprTypes.OPE_CHAIN;
                reqAxiomType = exprTypes.AXIOM_OPROP_SUB;

                if (axiom.type !== reqAxiomType || axiom.args[0].type !== opropChainType ||
                        axiom.args[0].args.length <= 2) {
                    return null;
                }

                opropType = exprTypes.ET_OPROP;       
                prevOprop = createEntity(opropType);
                srcChain = axiom.args[0].args; 
         
                normalized = [{
                    type: reqAxiomType,
                    args: [{
                        type: opropChainType,
                        args: [srcChain[0], srcChain[1]]
                    }, prevOprop] 
                }];
         
                lastOpropIndex = srcChain.length - 1;
         
                for (opropIndex = 2; opropIndex < lastOpropIndex; opropIndex += 1) {
                    newOprop = createEntity(opropType);
                    normalized.push({
                        type: reqAxiomType,
                        args: [{
                            type: opropChainType,
                            args: [prevOprop, srcChain[opropIndex]]
                        }, newOprop]
                    });
            
                    prevOprop = newOprop;
                }
         
                normalized.push({
                    type: reqAxiomType,
                    args: [{
                        type: opropChainType,
                        args: [prevOprop, srcChain[lastOpropIndex]]
                    }, axiom.args[1]]
                });
         
                return normalized;
            },
      
            /**
             * Checks if the given axiom is in the form A <= A1 n A2 n ... An., where A and Ai are 
             * class expressions. If this is the case, transforms it into the set of equivalent
             * axioms
             *  
             *  A <= A1
             *  A <= A2
             *  ...
             *  A <= An
             * .
             * 
             * @param axiom Axiom to apply the rule to.
             * @return Set of axioms which are result of applying the rule to the given axiom or 
             * null if the rule could not be applied.
             */
            function (axiom) {
                var exprs, exprIndex, firstArg, normalized, reqAxiomType;

                reqAxiomType = exprTypes.AXIOM_CLASS_SUB;

                if (axiom.type !== reqAxiomType || axiom.args[1].type !== exprTypes.CE_INTERSECT) {
                    return null;
                }
         
                exprs = axiom.args[1].args;

                normalized = [];
                firstArg = axiom.args[0];
         
                for (exprIndex = exprs.length; exprIndex--;) {
	                normalized.push({
	                    type: reqAxiomType,
	                    args: [firstArg, exprs[exprIndex]]
	                });
	            }
         
                return normalized;
            },
      
            /**
             * Checks if the given axiom is in the form C <= D, where C and D are complex class
             * expressions. If this is the case, transforms the axiom into two equivalent axioms
             *
             * C <= A
             * A <= D
             * 
             * where A is a new atomic class introduced.
             * 
             * @param axiom Axiom to apply the rule to.
             * @return Set of axioms which are result of applying the rule to the given axiom or 
             * null if the rule could not be applied.
             */
            function (axiom) {
                var classType, newClassExpr, reqAxiomType;
            
                classType = exprTypes.ET_CLASS;
                reqAxiomType = exprTypes.AXIOM_CLASS_SUB;

                if (axiom.type !== reqAxiomType || axiom.args[0].type === classType || 
                        axiom.args[1].type === classType) {
                    return null;
                }
         
	            newClassExpr = createEntity(classType);
         
                return [{
	                type: reqAxiomType,
	                args: [axiom.args[0], newClassExpr]
	            }, {
	                type: reqAxiomType,
	                args: [newClassExpr, axiom.args[1]]
	            }];
            },
      
            /**
             * Checks if the given axiom is in the form C1 n C2 n ... Cn <= C, where some Ci are
             * complex class expressions. If this is the case converts the axiom into the set of
             * equivalent axioms
             * 
             * Ci <= Ai
             * ..
             * C1 n ... n Ai n ... Cn <= C
             * 
             * where Ai are new atomic classes introduced to substitute complex class expressions
             * Ci in the original axiom.
             * 
             * @param axiom Axiom to try to apply the rule to.
             * @return Set of axioms which are result of applying the rule to the given axiom or 
             * null if the rule could not be applied.
             */
            function (axiom) {
                var args, argIndex, classExpr, classType, newClassExpr, newIntersectArgs,
                    normalized, reqAxiomType, reqExprType, ruleApplied;

                reqAxiomType = exprTypes.AXIOM_CLASS_SUB;
                reqExprType = exprTypes.CE_INTERSECT;
                classType = exprTypes.ET_CLASS;
            
	            if (axiom.type !== reqAxiomType || axiom.args[0].type !== reqExprType) {
                    return null;
                }
         
                // All expressions in the intersection.
                args = axiom.args[0].args; 

                normalized = [];
                newIntersectArgs = [];
                ruleApplied = false;
         
                for (argIndex = args.length; argIndex--;) {
                    classExpr = args[argIndex];
            
	                if (classExpr.type !== classType) {
	                    ruleApplied = true;
	                    newClassExpr = createEntity(classType);
                     
	                    normalized.push({
	                        type: reqAxiomType,
	                        args: [classExpr, newClassExpr]
	                    });
                     
	                    newIntersectArgs.push(newClassExpr);
	                } else {
	                    newIntersectArgs.push(classExpr);
	                }
	            }
               
	            if (ruleApplied) {
	                normalized.push({
	                    type: reqAxiomType,
	                    args: [{
	                        type: reqExprType,
	                        args: newIntersectArgs
	                    }, axiom.args[1]]
	                });
            
                    return normalized;
	            } else {
                    return null;
                }
            },
      
            /**
             * Checks if the given axiom is in the form E P.A <= B, where A is a complex class
             * expression. If this is the case converts the axiom into two equivalent axioms 
             * A <= A1 and E P.A1 <= B, where A1 is a new atomic class.
             * 
             * @param axiom Axiom to try to apply the rule to.
             * @return Set of axioms which are result of applying the rule to the given axiom or 
             * null if the rule could not be applied.
             */
            function (axiom) {         
                var firstArg, classType, newClassExpr, newObjSomeValuesExpr, reqAxiomType,
                    reqExprType;
                
                classType = exprTypes.ET_CLASS;
                reqAxiomType = exprTypes.AXIOM_CLASS_SUB;
                reqExprType = exprTypes.CE_OBJ_VALUES_FROM;

                if (axiom.type !== reqAxiomType || axiom.args[0].type !== reqExprType || 
                        axiom.args[0].classExpr.type === classType) {
                    return null;
                }

                firstArg = axiom.args[0];
         
                newClassExpr = createEntity(classType);
            
                newObjSomeValuesExpr = {
	                'type': reqExprType,
	                'opropExpr': firstArg.opropExpr,
	                'classExpr': newClassExpr
	            };

                return [{
	                'type': reqAxiomType,
	                'args': [firstArg.classExpr, newClassExpr]
	            }, {
	                'type': reqAxiomType,
	                'args': [newObjSomeValuesExpr, axiom.args[1]]
	            }];
            },
      
            /**
             * Checks if the given axiom is in the form A <= E P.B, where B is a complex class
             * expression. If this is the case converts the axiom into two equivalent axioms
             * B1 <= B and A <= E P.B1, where B1 is a new atomic class.
             * 
             * @param axiom Axiom to try to apply the rule to.
             * @return Set of axioms which are result of applying the rule to the given axiom or
             * null if the rule could not be applied.
             */
            function (axiom) {
                var classType, newClassExpr, reqAxiomType, reqExprType, secondArg;

                classType = exprTypes.ET_CLASS;
                reqAxiomType = exprTypes.AXIOM_CLASS_SUB;
                reqExprType = exprTypes.CE_OBJ_VALUES_FROM;
                                
                if (axiom.type !== reqAxiomType || axiom.args[1].type !== reqExprType || 
                        axiom.args[1].classExpr.type === classType) {
                    return null;
                }
         
	            secondArg = axiom.args[1];
         
                newClassExpr = createEntity(classType);
        
                return [{
	                'type': reqAxiomType,
	                'args': [newClassExpr, secondArg.classExpr]
	            }, {
	                'type': reqAxiomType,
	                'args': [axiom.args[0], {
	                    'type': reqExprType,
	                    'opropExpr': secondArg.opropExpr,
	                    'classExpr': newClassExpr
	                }]
	            }];
            },

            /**
             * Checks if the given statement is an axiom of the form Nothing <= A. If this is the
             * case, removes the axiom from the knowledge base (the axiom states an obvious thing).
             *
             * @param statement Statement to try to apply the rule to.
             * @return Set of statements which are the result of applying the rule to the given
             * statement or null if the rule could not be applied.
             */
            function (statement) {
                var firstArg;
                
                if (statement.type !== exprTypes.AXIOM_CLASS_SUB) {
                    return null;
                }
                
                firstArg = statement.args[0];
                
                if (firstArg.type === exprTypes.ET_CLASS && firstArg.IRI === jsw.owl.IRIs.NOTHING) {
                    return [];
                }
                
                return null;
            }
        ];

        // MAIN ALGORITHM
      
        // Copy all entities from the source to the destination ontology first.
        copyEntities();
        
        queue = createAxiomQueue();
        ruleCount = rules.length;

        while (!queue.isEmpty()) {
            axiom = queue.dequeue();
         
            // Trying to find a rule to apply to the axiom.
            for (ruleIndex = ruleCount; ruleIndex--;) {
                resultAxioms = rules[ruleIndex](axiom);
            
                if (resultAxioms !== null) {
                    // If applying the rule succeeded.
                    for (axiomIndex = resultAxioms.length; axiomIndex--;) {
                        queue.enqueue(resultAxioms[axiomIndex]);
                    }
               
                    break;
                }
            }
         
            if (ruleIndex < 0) {
                // If nothing can be done to the axiom, it is returned unchanged by all rule
                // functions and the axiom is in one of the normal forms already. 
                resultOntology.axioms.push(axiom);            
            }
        }

        return resultOntology;
    } 
};

/** Onotlogy represents a set of statements about some domain of interest. */
jsw.owl.Ontology = function () {	
    var exprTypes = jsw.owl.ExpressionTypes,
        classType = exprTypes.ET_CLASS,
        individualType = exprTypes.ET_INDIVIDUAL,
        opropType = exprTypes.ET_OPROP;

    /** Sets of entity IRIs of different types found in the ontology. */
    this.entities = {};
    this.entities[opropType] = {};
    this.entities[classType] = {};
    this.entities[individualType] = {};
   
    /** Contains all axioms in the ontology. */
    this.axioms = [];
    
    /** 
     * Contains all prefixes used in abbreviated entity IRIs in the ontology.
     * By default, contains standard prefixes defined by OWL 2 Structural Specification document.
     */
    this.prefixes = {
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        owl: 'http://www.w3.org/2002/07/owl#'
    };
   
    // Contains the numbers to be used in IRIs of next auto-generated entities.
    this.nextEntityNos = {};
    this.nextEntityNos[opropType] = 1;
    this.nextEntityNos[classType] = 1;
    this.nextEntityNos[individualType] = 1;    
   
    // Contains number of entities of each type in the ontology.
    this.entityCount = {};
    this.entityCount[opropType] = 0;
    this.entityCount[classType] = 0;
    this.entityCount[individualType] = 0;
};

jsw.owl.Ontology.prototype = {
    /** Types of expressions which the ontology can contain. */
    exprTypes: jsw.owl.ExpressionTypes,

    /**
     * Adds the given prefix to the ontology, so that the abbreviated IRIs of entities with this
     * prefix can be expanded.
     *
     * @param prefixName Name of the prefix.
     * @param iri IRI to use in abbreviated IRI expansion involving the prefix name.
     */
    addPrefix: function (prefixName, iri) {
        if (!this.prefixes[prefixName]) {
            this.prefixes[prefixName] = iri;
        } else {
            throw 'The prefix with the name "' + prefixName +
                '" is already defined in the ontology!';          
        }
    },

    /**
     * Allows generating a new unique IRI for the entity of the given type.
     * 
     * @param type Type of the entity to generate a new unique IRI for.
     * @return New unique IRI.
     */
    createUniqueIRI: function (type) {
        var entities,
            entityPrefix = this.getEntityAutoPrefix(type),
            nextEntityNo = this.entityCount[type] + 1,
            iri;
      
        entities = this.entities[type];
        iri = '';
         
        do {
            iri = entityPrefix + nextEntityNo;
	        nextEntityNo += 1;
	    } while (entities.hasOwnProperty(iri));

	    return iri; 
    },
   
    /**
     * Registers the given entity in the ontology.
     * 
     * @param type Type of the entity to register.
     * @param iri IRI of the entity.
     * @param isDeclared (optional) Indicates whether the entity has just been declared in the ontology and
     * not used in axioms yet. False by default.
     */
    registerEntity: function (type, iri, isDeclared) {
        var iris = jsw.owl.IRIs;
        
        // We don't want to regiter default entity IRIs.
        if (type === this.exprTypes.ET_CLASS && 
                (iri === iris.THING || iri === iris.NOTHING)) {
            return;
        }

        if (type === this.exprTypes.ET_OPROP &&
                (iri === iris.TOP_OBJECT_PROPERTY || iri === iris.BOTTOM_OBJECT_PROPERTY)) {
            return;
        }
        
        if (!this.entities[type].hasOwnProperty(iri)) {
            this.entityCount[type] += 1;
            this.entities[type][iri] = (!isDeclared) ? false : true;
        } else if (!isDeclared) {
            this.entities[type][iri] = false;
        }
    },
   
    /**
     * Checks if the ontology contains any references to the class with the given IRI.
     * 
     * @param iri IRI of the class to check.
     * @return True if the ontology has reverences to the class, false otherwise.
     */
    containsClass: function (iri) {
        if (iri === jsw.owl.IRIs.THING || iri === jsw.owl.IRIs.NOTHING ||
                this.entities[this.exprTypes.ET_CLASS].hasOwnProperty(iri)) {
            return true;
        } else {
            return false;
        }
    },
   
    /**

     * Checks if the ontology contains any references to the object property with the given IRI.
     * 
     * @param iri IRI of the object property to check.
     * @return True if the ontology has reverences to the object property, false otherwise.
     */
    containsObjectProperty: function (iri) {
        if (iri === jsw.owl.IRIs.TOP_OBJECT_PROPERTY || 
                iri === jsw.owl.IRIs.BOTTOM_OBJECT_PROPERTY ||
                this.entities[this.exprTypes.ET_OPROP].hasOwnProperty(iri)) {
            return true;
        } else {
            return false;
        }
    },   
   
    /**
     * Returns number of classes in the ontology.
     * 
     * @return Number of classes in the ontology.
     */
    getClassCount: function () {
        return this.entityCount[this.exprTypes.ET_CLASS];
    },
   
    /**
     * Returns an 'associative array' of all classes in the ontology.
     * 
     * @return 'Associative array' of all classes in the ontology.
     */
    getClasses: function () {
        return this.entities[this.exprTypes.ET_CLASS];
    },

    /**
     * Returns a prefix to be used in the automatically generated nams for entities of the given
     * type.
     *
     * @param type Integer specifying the type of entity to get the name prefix for.
     * @return Prefix to be used in the automatically generated nams for entities of the given
     * type.
     */
    getEntityAutoPrefix: function (type) {
        var exprTypes = this.exprTypes;

        switch (type) {
        case exprTypes.ET_CLASS:
            return 'C_';
        case exprTypes.ET_OPROP:
            return 'OP_';
        case exprTypes.ET_INDIVIDUAL:
            return 'I_';
        default:
            throw 'Unknown entity type "' + type + '"!';
        }
    },

    /**
     * Returns number of object properties in the ontology.
     * 
     * @return Number of object properties in the ontology.
     */
    getObjectPropertyCount: function () {
        return this.entityCount[this.exprTypes.ET_OPROP];
    },
   
    /**
     * Returns an 'associative array' of all object properties in the ontology.
     * 
     * @return 'Associative array' of all object properties in the ontology.
     */
    getObjectProperties: function () {
        return this.entities[this.exprTypes.ET_OPROP];
    },
   
    /**
     * Returns number of individuals in the ontology.
     * 
     * @return Number of individuals in the ontology.
     */
    getIndividualCount: function () {
        return this.entityCount[this.exprTypes.ET_INDIVIDUAL]; 
    },

   /**
    * Returns an 'associative array' of all individuals in the ontology.
    * 
    * @return 'Associative array' of all individuals in the ontology.
    */
    getIndividuals: function () {
        return this.entities[this.exprTypes.ET_INDIVIDUAL];
    }, 
   
    /**
     * Returns the number of axioms of the given types (optionally) in the ontology.
     *
     * @param types (optional) Array containing types of axioms to count. If the argument is not
     * provided, the total number of axioms is returned.
     * @return Number of axioms of the given types in the ontology.
     */
    getSize: function (types) {
        var axioms, axiomIndex, axiomType, size, typeCount, typeIndex;
    
        if (!types) {
            return this.axioms.length;
        }

        axioms = this.axioms;
        typeCount = types.length;
        size = 0;      

        for (axiomIndex = axioms.length; axiomIndex--;) {
            axiomType = axioms[axiomIndex].type;
         
            for (typeIndex = typeCount; typeIndex--;) {
                if (axiomType === types[typeIndex]) {
                    size += 1;
                    break;
                }
            }
        }
      
        return size;
    },

    /**
     * Returns the size of ABox of the ontology.
     * 
     * @return Size of the ABox of the ontology.
     */
    getABoxSize: function () {
        var exprTypes = this.exprTypes;
        return this.getSize([exprTypes.FACT_CLASS, exprTypes.FACT_OPROP]);
    },
   
    /**
     * Returns the size of TBox of the ontology.
     * 
     * @return Size of the TBox of the ontology.
     */
    getTBoxSize: function () {
        var et = this.exprTypes;
        
        return this.getSize([et.AXIOM_CLASS_EQ, et.AXIOM_CLASS_SUB, et.AXIOM_CLASS_DISJOINT,
            et.AXIOM_OPROP_SUB, et.AXIOM_OPROP_EQ, et.AXIOM_OPROP_REFL, et.AXIOM_OPROP_TRAN]);
    },

    /**
     * Resolves the given prefixName and otherPart to a full IRI. Checks if the prefix with the
     * given name is defined in the ontology.
     *
     * @param prefixName Name of the prefix.
     * @param otherPart Other (non-prefix) part of the abbreviated IRI.
     * @return Full IRI resolved.
     */
    resolveAbbreviatedIRI: function (prefixName, otherPart) {
        if (!this.prefixes[prefixName]) {
            throw 'Unknown IRI prefix "' + prefixName + '!"';
        }

        return this.prefixes[prefixName] + otherPart;
    }
};

// ================================ UTIL namespace ============================

jsw.util = {};

/** Contains helper methods for working with strings. */
jsw.util.string = {
    /**
     * Checks if the given string is a valid URL.
     * @param str String to check.
     * @return True if the given string is a URL, false otherwise.
     */
    isUrl: function (str) {
        var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
        return regexp.test(str);
    },
    
    /**
     * Removes space characters at the start and end of the given string. 
     * 
     * @param str String to trim.
     * @return New string with space characters removed from the start and the end. 
     */
    trim: function (str) {
        return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
};

/** An object containing utility methods for working with XML. */
jsw.util.xml = {
    /**
     * Parses string into the XML DOM object in a browser-independent way.
     *
     * @param xml String containing the XML text to parse.
     * @return XML DOM object representing the parsed XML.
     */
    parseString: function (xml) {
        var xmlDoc, error;

        xml = jsw.util.string.trim(xml);

        if (window.DOMParser) {
            xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
            
            if (xmlDoc.documentElement.nodeName === 'parsererror') { // Firefox
                throw xmlDoc.documentElement.childNodes[0].nodeValue;
            } else if (xmlDoc.documentElement.childNodes[0] &&
                    xmlDoc.documentElement.childNodes[0].childNodes[0] && 
                    xmlDoc.documentElement.childNodes[0].childNodes[0].nodeName === 'parsererror') {
                // Chrome
                throw xmlDoc.documentElement.childNodes[0].childNodes[0].childNodes[1].innerText;
            }

            return xmlDoc;
        } else { // IE
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xml); 

            error = xmlDoc.parseError;

            if (error.errorCode !== 0) {
                throw 'Can not parse the given onotology OWL/XML:' +
                    '\nError in line ' + error.line + ' position ' + error.linePos +
                    '\nError Reason: ' + error.reason;
            }
        }

        return xmlDoc;
    }
};

/** Represents a queue implementing FIFO mechanism. */
jsw.util.Queue = function () {
    this.queue = [];
    this.emptyElements = 0;
};

/** Prototype for all jsw.util.Queue objects. */
jsw.util.Queue.prototype = {
    /**
     * Checks if the queue has no objects.
     * 
     * @return True if there are no objects in the queue, fale otherwise.
     */
    isEmpty: function () { 
        return this.queue.length === 0; 
    },
   
    /**
     * Adds an object to the queue.
     * 
     * @param obj Object to add to the queue.
     */
    enqueue: function (obj) {
        this.queue.push(obj);
    },
   
    /**
     * Removes the oldest object from the queue and returns it.
     * 
     * @return The oldest object in the queue.
     */
    dequeue: function () {
        var element,
            emptyElements = this.emptyElements,
            queue = this.queue,
            queueLength = queue.length;

        if (queueLength === 0) {
            return null;
        }

        element = queue[emptyElements];
        emptyElements += 1;
  
        // If the queue has more than a half empty elements, shrink it.    
        if (emptyElements << 1 >= queueLength - 1) {
            this.queue = queue.slice(emptyElements);
            this.emptyElements = 0;
        } else {
            this.emptyElements = emptyElements;
        }
      
        return element;
    }
};

/** Stopwatch allows measuring time between different events. */
jsw.util.Stopwatch = function () {
    var startTime, // Time (in miliseconds) when the stopwatch was started last time.
        elapsedMs = null; // Contains the number of miliseconds in the last measured period of time.
   
    /**
     * Returns textual representation of the last measured period of time.
     *
     * @return Textual representation of the last measured period of time.
     */
    this.getElapsedTimeAsText = function () {
        var miliseconds = elapsedMs % 1000,
            hours = Math.floor(elapsedMs / 3600000),
            minutes = Math.floor(elapsedMs % 3600000 / 60000),
            seconds = Math.floor(elapsedMs % 60000 / 1000);
        
        if (miliseconds < 10) {
            miliseconds = '00' + miliseconds.toString();
        } else if (miliseconds < 100) {
            miliseconds = '0' + miliseconds.toString();
        }

        return hours + ' : ' + minutes + ' : ' + seconds + '.' + miliseconds;
    };
   
    /**
     * Starts measuring the time.
     */
    this.start = function () {
        startTime = new Date().getTime();
        elapsedMs = null;
    };
   
    /**
     * Stops measuring the time.
     * 
     * @return Textual representation of the measured period of time.
     */
    this.stop = function () {
        elapsedMs = new Date().getTime() - startTime;
        return this.getElapsedTimeAsText();
    };
};

/** Pair storage can be used to hash 2-tuples by the values in them in some order. */
jsw.util.PairStorage = function () {
    /** Data structure holding all pairs. */
    this.storage = {};
};

/** Prototype for all jsw.util.PairStorage objects. */
jsw.util.PairStorage.prototype = {
    /**
     * Adds a new tuple to the storage.
     *
     * @param first Value of the first element of the tuple.
     * @param second Value for the second element of the tuple.
     */
    add: function (first, second) {
        var storage = this.storage;

        if (!storage[first]) {
            storage[first] = {};
        }
            
        storage[first][second] = true;
    },

    /**
     * Builds a hierarchy (direct acyclic graph) from the relation stored, assuming that the
     * relation is antisymmetric.
     *
     * @param diffRelation (optional) PairStorage containing the 'difference' relation. If given, 
     * all relations in the hierarchy which are not present in diffRelation will be marked as
     * 'special' in the resulting hierarchy.
     * @return Object representing the hierarchy implied by the relation.
     */
    buildHierarchy: function (diffRelation) {
        var child, childCount, childIndex, obj, objInfo, curObj, curObjChildren, hierarchy, names,
            newObj, nodeChildren, stack, self, hasParents, parent, parents, storage;

        /**
         * Inserts the given object into the DAG.
         *
         * @param obj Object to insert.
         * @param candidates Array containing 'candidate' objects which could be the direct parents
         * of the given object.
         */
        function dagInsert(obj, candidates) {
            var candidate, candidateIndex, changesHappened, children, node, marked, parent, parents;

            marked = {};

            for (candidateIndex = candidates.length; candidateIndex--;) {
                parents = objInfo[candidates[candidateIndex]].parents;

                for (parent in parents) {
                    if (parents.hasOwnProperty(parent)) {
                        marked[parent] = true;
                    }
                }
            }

            do {
                changesHappened = false;

                for (node in marked) {
                    if (marked.hasOwnProperty(node)) {
                        parents = objInfo[node].parents;

                        for (parent in parents) {
                            if (parents.hasOwnProperty(parent) && !marked[parent]) {
                                marked[parent] = true;
                                changesHappened = true;
                            }
                        }
                    }
                }
            } while (changesHappened);

            parents = objInfo[obj].parents;

            for (candidateIndex = candidates.length; candidateIndex--;) {
                candidate = candidates[candidateIndex];
                children = objInfo[candidate].children;

                if (children && !marked[candidate]) {
                    parents[candidate] = true;
                    children[obj] = true;
                }
            }
        }

        /**
         * Adds the given object and all of its ancestors/descendants to the DAG.
         *
         * @param obj Object to add to the DAG.
         */
        function dagClassify(obj) {
            var candidates = [],
                equivalents = [],
                parent;

            objInfo[obj] =  {
                'children': {},
                'equivalents': equivalents,
                'parents': {}
            };

            for (parent in self.get(obj)) {
                if (self.exists(parent, obj)) {
                    if (parent !== obj) {
                        objInfo[parent] = {
                            'equivalents': [obj]
                        };

                        equivalents.push(parent);
                    }
                } else {
                    if (!objInfo[parent]) {
                        dagClassify(parent);
                    }
                    
                    candidates.push(parent);
                }
            }

            dagInsert(obj, candidates);
        }

        /**
         * Function used to sort objects in the hierarchy generated.
         *
         * @param objA Object representing the first class.
         * @param objB Object representing the second class.
         * @return 0 if the class names are equal, 1 if the second class name follows the first one
         * in alphabetic order, -1 otherwise.
         */
        function sortFunc(objA, objB) {
            var nameA = objA.names[0], nameB = objB.names[0];

            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        }

        /**
         * Creates an object to be later inserted into the hierarchy generated.
         *
         * @param name Name of the object to create.
         * @param parentNames (optional) Names of the parent object.
         * @return Object to be later inserted into the hierarchy generated.
         */
        function createHierarchyObj(name, parentNames) {
            var equivalent, equivalents, equivalentCount, equivalentIndex, names, parentCount,
                parentIndex, shouldCheckSpecial, special;
            
            names = [name];
            equivalents = objInfo[name].equivalents;
            equivalentCount = equivalents.length;
            shouldCheckSpecial = parentNames && diffRelation;

            special = false;

            if (shouldCheckSpecial) {
                parentCount = parentNames.length;

                for (parentIndex = 0; parentIndex < parentCount; parentIndex += 1) {
                    if (!diffRelation.exists(name, parentNames[parentIndex])) {
                        special = true;
                        break;
                    }
                }
            }

            for (equivalentIndex = 0; equivalentIndex < equivalentCount; equivalentIndex += 1) {
                equivalent = equivalents[equivalentIndex];
                names.push(equivalent);

                if (shouldCheckSpecial) {
                    for (parentIndex = 0; parentIndex < parentCount; parentIndex += 1) {
                        if (!diffRelation.exists(equivalent, parentNames[parentIndex])) {
                            special = true;
                            break;
                        }
                    }
                }                
            }

            if (special) {
                return {
                    'names': names,
                    'children': [],
                    'special': true
                };
            } else {
                return {
                    'names': names,
                    'children': []
                };
            }
        }

        // MAIN ALGORITHM

        self = this;
        objInfo = {};
        storage = this.storage;

        for (obj in storage) {
            if (storage.hasOwnProperty(obj) && !objInfo[obj]) {
                dagClassify(obj);
            }
        }

        hierarchy = [];
        stack = [];

        for (obj in objInfo) {
            curObj = objInfo[obj];
            parents = curObj.parents;

            if (parents) {
                hasParents = false;

                for (parent in parents) {
                    if (parents.hasOwnProperty(parent)) {
                        hasParents = true;
                        break;
                    }
                }

                if (!hasParents) {
                    newObj = createHierarchyObj(obj);
                    hierarchy.push(newObj);
                    stack.push(newObj);
                }
            }
        }

        while (stack.length > 0) {
            curObj = stack.pop();
            curObjChildren = curObj.children;
            names = curObj.names;
            nodeChildren = objInfo[names[0]].children;

            for (child in nodeChildren) {
                if (nodeChildren.hasOwnProperty(child)) {
                    newObj = createHierarchyObj(child, names);
                    curObjChildren.push(newObj);
                    stack.push(newObj);
                }
            }
        }

        // Sort names of equivalent classes and children of every class by name.
        childCount = hierarchy.length;

        for (childIndex = 0; childIndex < childCount; childIndex += 1) {
            curObj = hierarchy[childIndex];
            curObj.names.sort();
            stack.push(curObj);
        }

        while (stack.length > 0) {
            curObj = stack.pop();
            curObjChildren = curObj.children;

            childCount = curObjChildren.length;

            for (childIndex = 0; childIndex < childCount; childIndex += 1) {
                child = curObjChildren[childIndex];

                child.names.sort();
                stack.push(child);
            }

            curObjChildren.sort(sortFunc);
        }

        return hierarchy.sort(sortFunc);
    },
   
    /**
     * Removes part of the relation specified by the arguments. 
     * 
     * @param first First value in the pairs to remove.
     * @param second (optional) Second value in the pairs to remove.
     */
    remove: function (first, second) {
        var firstPairs = this.storage[first];
        
        if (!firstPairs) {
            return;
        }
        
        if (second) {
            delete firstPairs[second];
        } else {
            delete this.storage[first];
        }
    },
   
    /**
     * Checks if the tuple with the given values exists within the storage.
     * 
     * @param first First value in the pair.
     * @param second Second value in the pair.
     * @return True if the tuple with the given value exists, false otherwise.
     */
    exists: function (first, second) {
        var firstPairs = this.storage[first];
            
        if (!firstPairs) {
            return false;
        }
            
        return firstPairs[second] || false;
    },
            
    /**
     * Checks if tuples with the given first value and all of the given second values exist within
     * the storage.
     * 
     * @param first First value in the tuple.
     * @param second Array containing the values for second element in the tuple. 
     * @return True if the storage contains all the tuples, false otherwise.
     */
    existAll: function (first, second) {
        var secondPairs, secondValue;
            
        if (!second) {
            return true;
        }
        
        secondPairs = this.storage[first];        
    
        if (!secondPairs) {
            return false;
        }
            
        for (secondValue in second) {         
            if (!secondPairs[secondValue]) {
                // Some entity from subsumers array is not a subsumer.
                return false;
            }
        }
         
        return true;
    },         

    /**
     * Returns an object which can be used to access all pairs in the storage with (optionally)
     * the fixed value of the first element in all pairs.
     * 
     * @param first (optional) The value of the first element of all pairs to be returned.
     * @return Object which can be used to access all pairs in the storage.
     */
    get: function (first) {
        if (!first) {
            return this.storage;
        }
            
        return this.storage[first] || {};
    }
};
   
/**
 * Triple storage can be used to hash 3-tuples by the values in them in some order.
 * 
 * @return Object which can be used to hash 3-tuples by the values in them in some order.
 */
jsw.util.TripleStorage = function () {
    /**
     * Data structure holding all 3-tuples.
     */
    this.storage = {};
};

jsw.util.TripleStorage.prototype = {
    /**
     * Returns all Triples for a fixed value of the 1-st element in Triples and (optionally) the 
     * 2-nd one.
     *  
     * @param first Value of the first element of the returned Triples.
     * @param second (optional) Value of the second element of the returned Triples.
     * @return Object containing the Triples requested.
     */
    get: function (first, second, third) {
        var firstTuples;
        
        if (!first) {
            return this.storage;
        }

        firstTuples = this.storage[first];

        if (!firstTuples) {
            return {};
        }
            
        if (!second) {
            return firstTuples;
        }
            
        return firstTuples[second] || {};
    },
         
    /**
     * Adds the given Triple to the storage.
     * 
     * @param first Value of the first element in the Triple.
     * @param second Value of the second element in the Triple.
     * @param third Value of the third element in the Triple.
     */
    add: function (first, second, third) {
        var storage = this.storage;

        if (!storage[first]) {
            storage[first] = {};
        }
            
        if (!storage[first][second]) {
            storage[first][second] = {};
        }
            
        storage[first][second][third] = true;
    },
         
    /**
     * Checks if the given Triple exists in the storage.
     * 
     * @param first Value of the first element in the Triple.
     * @param second Value of the second element in the Triple.
     * @param third Value of the third element in the Triple.
     * @return True if the value exists, false otherwise.
     */
    exists: function (first, second, third) {
        var storage = this.storage,
            firstStorage = storage[first],
            secondStorage;

        if (!firstStorage) {
            return false;
        }
    
        secondStorage = firstStorage[second];

        if (!secondStorage) {
            return false;
        }
            
        if (!secondStorage[third]) {
            return false;
        }
            
        return true;
    }
};

/**
 * TextFile objects allow loading the text content of the file specified by the url.
 * 
 * @param url URL of the text file.
 */
jsw.util.TextFile = function (url) {
    var newUrl = jsw.util.string.trim(url);
    
    if (!jsw.util.string.trim(newUrl)) {
        throw '"' + url + '" is not a valid url for a text file!';
    }
   
    /** URL of the file. */
    this.url = newUrl;
};

/** Prototype for all TextFile objects. */
jsw.util.TextFile.prototype = {
    /**
     * Returns the content of the file as text.
     * 
     * @returns Content of the file as text.
     */
    getText: function () {
        var newUrl = jsw.util.string.trim(this.url),
            xhr;
    
        if (!jsw.util.string.trim(newUrl)) {
            throw '"' + this.url + '" is not a valid url for a text file!';
        }
        
        if (window.XMLHttpRequest &&
                (window.location.protocol !== "file:" || !window.ActiveXObject)) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }
         
        try {
            xhr.open('GET', this.url, false);
            xhr.send(null);
            return xhr.responseText;
        } catch (ex) {
            throw ex;
        }
    } 
};
